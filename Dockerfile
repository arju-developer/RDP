# Base image
FROM ubuntu:20.04

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
    && apt-get clean

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
