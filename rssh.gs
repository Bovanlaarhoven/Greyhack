shell = get_shell("Hydra", "noobmaster")
host = get_shell("Hydra", "noobmaster").host_computer
sshFile = host.File("/home/Hydra/Logins.txt")
lines = sshFile.get_content.split("\n")
randomLineIndex = floor(rnd * lines.len)
randomLine = lines[randomLineIndex]
shell.launch("/bin/ssh", randomLine)