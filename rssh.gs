shell = get_shell("Hydra", "noobmaster").host_computer
path = shell.File("/home/Hydra/Logins.txt")
print("Script gets executed within: " + parent_path(path))