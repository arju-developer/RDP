<h1>
    1
   sudo apt update -y && sudo apt upgrade -y
   
    2
   sudo apt install wget -y

    3 
 sudo wget https://dl.google.com/linux/direct/chrome-remote-desktop_current_amd64.deb
    
    4
  sudo apt install ./chrome-remote-desktop_current_amd64.deb -y

    5

    
  sudo DEBIAN_FRONTEND=noninteractive \
 apt install --assume-yes xfce4 desktop-base dbus-x11 xscreensaver

     6
 sudo bash -c 'echo "exec /etc/X11/Xsession /usr/bin/xfce4-session" > /etc/chrome-remote-desktop-session'

     7
  sudo systemctl disable lightdm.service
 
     8  {SSH_URL}  
</h1>


#Install Firefox 🌚💀🍆



sudo install -d -m 0755 /etc/apt/keyrings




wget -q https://packages.mozilla.org/apt/repo-signing-key.gpg -O- | sudo tee /etc/apt/keyrings/packages.mozilla.org.asc > /dev/null






gpg -n -q --import --import-options import-show /etc/apt/keyrings/packages.mozilla.org.asc | awk '/pub/{getline; gsub(/^ +| +$/,""); if($0 == "35BAA0B33E9EB396F59CA838C0BA5CE6DC6315A3") print "\nThe key fingerprint matches ("$0").\n"; else print "\nVerification failed: the fingerprint ("$0") does not match the expected one.\n"}'







echo "deb [signed-by=/etc/apt/keyrings/packages.mozilla.org.asc] https://packages.mozilla.org/apt mozilla main" | sudo tee -a /etc/apt/sources.list.d/mozilla.list > /dev/null







echo '
Package: *
Pin: origin packages.mozilla.org
Pin-Priority: 1000
' | sudo tee /etc/apt/preferences.d/mozilla






sudo apt-get update && sudo apt-get install firefox




🤷🏻‍♂️ Thanks for Copy it 🤬🐶

