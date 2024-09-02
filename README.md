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
