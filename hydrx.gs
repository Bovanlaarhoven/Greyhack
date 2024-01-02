metaxploit = include_lib("/lib/metaxploit.so")
Address = params[0]
isLan = is_lan_ip(Address)

ports = {
    ["ftp"] = [21],
    ["ssh"] = [22]
}

if typeof(Address) == "string" then
    ip = nslookup(Address)
else
    ip = Address
end if 

if isLan then
    router = get_router()
else
    router = get_router(Address)
end if

if not isLan then
    ports = router.used_ports
else
    ports = router.device_ports(Address)
end if

if ports != ports then
    print("No ports supported")
end if
