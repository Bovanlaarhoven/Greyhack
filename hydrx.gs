metaxploit = include_lib("/lib/metaxploit.so")
Address = params[0]

if typeof(Address) == "string" then
    ip = nslookup(Address)
else
    ip = Address
end if 

isLan = is_lan_ip(ip)

if isLan then
    router = get_router()
else
    router = get_router(ip)
end if

if not isLan then
    ports = router.used_ports
else
    ports = router.device_ports(ip)
end if

for port in ports
    if not params.len == 2 then
        service_info = router.port_info(port)
        lan_ips = port.get_lan_ip()
        port_state = "open"

        if (port.is_closed and not isLan) then
            port_state = "closed"
        end if

        info = port.port_number + " " + port_state + " " + service_info
        print(info)
    end if
end for

if params.len == 2 then
    port = params[1]
else
    port = user_input("Port: ")
    port = port.to_int()
end if

net_session = metaxploit.net_use(ip, port)
metaLib = net_session.dump_lib
Scan = metaxploit.scan(metaLib)
target = Scan[0]
ScanAddress = metaxploit.scan_address(metaLib ,Scan[0])

wait(1)

segments = ScanAddress.split("Unsafe check: ")
exploit = null
 for segment in segments
   hasRequirement = segment.indexOf("*") != null
   if (not hasRequirement) then
      labelStart = segment.indexOf("<b>")
      labelEnd = segment.indexOf("</b>")
      exploit = segment[labelStart + 3: labelEnd]
   end if
end for
if (exploit) then
   print("Exploiting... " + target + ":" + exploit)
   print(metaLib.overflow(target, exploit))
else
   print("No exploit found with zero requirements")
end if