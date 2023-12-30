crypto = include_lib("/lib/crypto.so")

GetPassword = function(info)
    if info.len != 2 then exit("Decipher: Invalid arguments")
    password = crypto.Decipher(info[0], info[1])
    return password
end function 