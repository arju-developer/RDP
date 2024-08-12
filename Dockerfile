# Base image
FROM ubuntu:20.04

# Set environment variables for non-interactive installs
ENV DEBIAN_FRONTEND=noninteractive

# Update and install necessary packages
RUN apt-get update && apt-get install -y \
    wget \
    software-properties-common \
    xrdp \
    xfce4 \
    xfce4-goodies \
    dbus-x11 \
    x11-xserver-utils \
    sudo \
    curl \
    locales \
    tzdata \
    gnupg \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*

# Set the timezone to Indian Ocean
RUN ln -fs /usr/share/zoneinfo/Indian/Mahe /etc/localtime && \
    dpkg-reconfigure -f noninteractive tzdata

# Set locale to UK English and configure keyboard layout to UK
RUN locale-gen en_GB.UTF-8 && \
    update-locale LANG=en_GB.UTF-8 && \
    echo "keyboard-configuration keyboard-configuration/layout select 'English (UK)'" | debconf-set-selections && \
    echo "keyboard-configuration keyboard-configuration/variant select 'English (UK)'" | debconf-set-selections && \
    dpkg-reconfigure -f noninteractive keyboard-configuration

# Install Google Chrome
RUN wget https://dl.google.com/linux/direct/google-chrome-stable_current_amd64.deb && \
    dpkg -i google-chrome-stable_current_amd64.deb || apt-get -f install -y && \
    apt-get clean && rm google-chrome-stable_current_amd64.deb

# Install Chrome Remote Desktop
RUN wget https://dl.google.com/linux/direct/chrome-remote-desktop_current_amd64.deb && \
    dpkg -i chrome-remote-desktop_current_amd64.deb || apt-get -f install -y && \
    apt-get clean && rm chrome-remote-desktop_current_amd64.deb

# Install XFCE and related packages for Chrome Remote Desktop
RUN apt-get update && apt-get install -y \
    xfce4 \
    desktop-base \
    xscreensaver \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*

# Configure Chrome Remote Desktop to use XFCE
RUN echo "exec /etc/X11/Xsession /usr/bin/xfce4-session" > /etc/chrome-remote-desktop-session

# Disable the lightdm service to avoid conflicts
RUN systemctl disable lightdm.service

# Create a non-root user and set password
RUN useradd -m chrome-user && echo "chrome-user:123456" | chpasswd && adduser chrome-user sudo

# Add the user to the chrome-remote-desktop group
RUN usermod -a -G chrome-remote-desktop chrome-user

# Expose RDP port
EXPOSE 3389

# Set up Chrome Remote Desktop with a PIN and updated URL
USER chrome-user
RUN DISPLAY= /opt/google/chrome-remote-desktop/start-host --code="4/0AcvDMrD17MWdwFDpVkVMIUXwBlz9uSk3lKlmS5IszN_RdXeTODq8mcEkFDZCE79BPPsHYQ" --redirect-url="https://remotedesktop.google.com/_/oauthredirect" --name=$(hostname) --user-name=chrome-user --pin=123456

# Start XRDP service and Chrome Remote Desktop, then keep the container running
CMD sudo service xrdp start && /opt/google/chrome-remote-desktop/start-host && tail -f /dev/null
