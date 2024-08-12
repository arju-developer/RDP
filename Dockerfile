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
    && apt-get clean

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
RUN wget https://dl.google.com/linux/direct/google-chrome-stable_current_amd64.deb \
    && dpkg -i google-chrome-stable_current_amd64.deb || apt-get -f install -y \
    && apt-get clean

# Install Chrome Remote Desktop
RUN wget https://dl.google.com/linux/direct/chrome-remote-desktop_current_amd64.deb \
    && dpkg -i chrome-remote-desktop_current_amd64.deb || apt-get -f install -y \
    && apt-get clean

# Setup XRDP
RUN echo xfce4-session >~/.xsession \
    && adduser xrdp ssl-cert

# Expose RDP port
EXPOSE 3389

# Set up Chrome Remote Desktop
ENV DISPLAY=:0
RUN /opt/google/chrome-remote-desktop/start-host --code="4/0AcvDMrCT_Zgzge9tL2z0Wal-B9KyCgFA_gX6YzXxs8akzTrlaONG4ZOqCb1A3hGFq8mibQ" \
    --redirect-url="https://remotedesktop.google.com/_/oauthredirect" --name=$(hostname)

# Start XRDP service and Chrome Remote Desktop, then keep the container running
CMD service xrdp start && /opt/google/chrome-remote-desktop/start-host && tail -f /dev/null
