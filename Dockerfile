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

# Setup XRDP
RUN echo xfce4-session >~/.xsession \
    && adduser xrdp ssl-cert

# Expose RDP port
EXPOSE 3389

# Start XRDP service and keep the container running
CMD service xrdp start && tail -f /dev/null
