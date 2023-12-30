crypto = include_lib("/lib/crypto.so")

Getpassword = function(userPass)
    if userPass.len != 2 then exit("Decipher: " + file.path + " wrong syntax")
    password = crypto.decipher(userPass[1])
    return password
end function

if params.len != 1 or params[0] == "-h" or params[0] == "--help" then exit(command_info("decipher_sage"))

origFile = params[0]
file = get_shell.host_computer.File(origFile)
if not file then exit("Decipher: " + origFile + " not found")
if not file.has_permission("r") then exit("Decipher: " + origFile + " permission denied")
if file.get_content.len == 0 then exit("Decipher: " + origFile + " is empty")

lines = file.get_content.split("\n")
password = null
if lines.len == 1 then
    userpass = lines[0].split(":")
    password = Getpassword(userpass)
else
    print("Multiple passwords detected")
    numLine = 1
    for line in lines
        if line.len > 0 then
            print(numLine + ": " + line)
            numLine = numLine + 1
        end if
    end for
    option = ""
    inputOK = false
    while ( not inputOK )
        option = user_input("Select User: ").to_int
        if typeof(option)  != "number" or (option < 1 or option > lines.len) then
            print("Invalid option")
        else
            inputOK = true
        end if
    end while
    userpass = lines[option - 1].split(":")
    print("User: " + userpass[0])
    password = Getpassword(userpass)
end if

if not password then exit("Decipher: " + origFile + " password not found")
print("Password: " + password)