if params.len != 1 or params[0] == "-h" or params[0] == "--help" then exit(command_info)
if not get_shell.host_computer.is_network_active then exit("nmap: network is not active")

ip = params[0]

if typeof(ip) == "string" then
    ipAddress = nslookup(ip)
else
    ipAddress = ip.to_int()
end if    
    
isLanIp = is_lan_ip(ipAddress)

if isLanIp then
    router = get_router()
else
    router = get_router(ipAddress)
end if

if router == null then exit ("nmap: could not find router")
ports = null

if not isLanIp then
    ports = router.used_ports
else
    ports = router.device_ports(ipAddress)
end if

if ports == null then exit("nmap: could not find ports")
if typeof(ports) == "string" then exit(ports)

info = "PORT STATE SERVICE Version\n"
if ports.len == 0 then exit ("nmap: no ports found")

for port in ports
    service_info = router.port_info(port)
    lan_ips = port.get_lan_ip()
    port_state = "open"

    if (port.is_closed and not isLanIp) then
        port_state = "closed"
    end if
    info = info + port.port_number + " " + port_state + " " + service_info + "\n"
end for

print(format_columns(info) + "\n")
