if not is_valid_ip(params[0]) then exit("Not a valid Ip address") 

Address = params[0]
lan = is_lan_ip(Address)

if lan then
    router = get_router()
else
    router = get_router(Address)
end if

if not lan then
    ports = router.used_ports
else
    ports = router.device_ports(ipAddress)
end if

print("Ports: " + ports.port_number)