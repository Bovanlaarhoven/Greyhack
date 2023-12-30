crypto = include_lib("/lib/crypto.so")
crypto.airmon("start", "wlan0")

networks = get_shell.host_computer.wifi_networks("wlan0")

for index in range(0, networks.len - 1)
    print(index + ".) " + networks[index])
end for

selectedIndex = user_input("Select Wifi: ").to_int

if (typeof(selectedIndex) == "string" or selectedIndex < 0 or selectedIndex > networks.len - 1) then
    exit("Wrong index!")
end if

parsed = networks[selectedIndex].split(" ")
bssid = parsed[0]
pwr = parsed[1][:-1].to_int
essid = parsed[2]
potentialAcks = 300000 / pwr

crypto.aireplay(bssid, essid, potentialAcks)

wifiPassword = crypto.aircrack("/home/" + active_user + "/file.cap")

print("Wifi password for " + essid + " is " + wifiPassword)

connectionResult =  get_shell.host_computer.connect_wifi("wlan0", bssid, essid, wifiPassword)

if typeof(connectionResult) == "string" then
   print("There was an error while connecting to new Wifi: " + connectionResult)
else
   print("Connected to new Wifi successfully.")
end if
