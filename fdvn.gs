metaxploit = include_lib("/lib/metaxploit.so")
Address = params[0]
port = params[1].to_int()

net_session = metaxploit.net_use(Address, port)
metaLib = net_session.dump_lib
Scan = metaxploit.scan(metaLib)
ScanAddress = metaxploit.scan_address(metaLib, Scan[1])
segments = ScanAddress.split("Unsafe check: ")[1:]
exploits = []

for segment in segments
    labelStart = segment.indexOf("<b>")
    labelEnd = segment.indexOf("</b>")
    exploits.push(segment[labelStart + 3: labelEnd])
end for

for i in range(1, len(Scan) + 1)
    if i <= len(exploits) and i <= len(Scan) and i > 0 then
        if params.len == 3 then
            password = params[2]
            result = metaLib.overflow(Scan[i - 1], exploits[i - 1], password)
        else
            result = metaLib.overflow(Scan[i - 1], exploits[i - 1])
        end if
        if result != null then
            print("Attack successful!")
            print("Scan[" + i + "]: " + Scan[i - 1])
            print("Exploit[" + i + "]: " + exploits[i - 1])
            print("Memory address: " + Scan[i - 1])
            break
        end if
    end if
end for

if result != null then
    type = typeof(result)
    if type == "shell" then result.start_terminal
    if type == "computer" then
        passFile = result.File("/etc/passwd")
        if not passFile then exit("File not found")
        if passFile.has_permission("r") then
            if passFile == null then exit("File Empty")
            fileLocation = "/home/"+active_user
            createFile = get_shell.host_computer.File(fileLocation+"/receivedpasswd.txt")
            if createFile then createFile.delete
            get_shell.host_computer.touch(fileLocation, "receivedpasswd.txt")
            get_shell.host_computer.File(fileLocation+"/receivedpasswd.txt").set_content(result.File("/etc/passwd").get_content)
            createFile = get_shell.host_computer.File(fileLocation+"/receivedpasswd.txt")
        else
            exit("Unable to access password file")
        end if
        if createFile == null then
            createFile.delete
            exit("File was empty")
        end if
        while true
            print("Option: ")
            print("1. Decipher")
            print("2. Remove file with passwords")
            print("0. Exit")
            opt = user_input("Option: ")
            if opt == "0" then exit("Exiting")
            if opt == "1" then
                get_shell.launch("/bin/decipher", fileLocation+"/receivedpasswd.txt")
            end if
            if opt == "2" then
                if createFile then createFile.delete
                exit("File deleted")
            end if
        end while
    end if
else
    exit("Attack failed")
end if
