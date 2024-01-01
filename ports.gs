if not is_valid_ip(params[0]) then exit("Not a valid Ip address") 

Address = params[0]
lan = is_lan_ip(Address)

if lan then
    router = get_router()
else
    router = get_router(Address)
end if

ports = used_ports(router)

for port in ports
    print(port_number(port))
end for