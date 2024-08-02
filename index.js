// Function to install Chrome Remote Desktop
function installCRD() {
    exec('wget https://dl.google.com/linux/direct/chrome-remote-desktop_current_amd64.deb', (error, stdout, stderr) => {
        if (error) {
            console.error(`Error downloading CRD package: ${error}`);
            return;
        }
        
        console.log('CRD package downloaded successfully.');

        exec('sudo dpkg -i chrome-remote-desktop_current_amd64.deb', (error, stdout, stderr) => {
            if (error) {
                console.error(`Error installing CRD package: ${error}`);
                return;
            }

            console.log('CRD package installed successfully.');

            exec('sudo apt install --assume-yes --fix-broken', (error, stdout, stderr) => {
                if (error) {
                    console.error(`Error fixing dependencies: ${error}`);
                    return;
                }

                console.log('Dependencies fixed.');

                exec('sudo DEBIAN_FRONTEND=noninteractive apt install --assume-yes xfce4 desktop-base', (error, stdout, stderr) => {
                    if (error) {
                        console.error(`Error installing desktop environment: ${error}`);
                        return;
                    }

                    console.log('Desktop environment installed.');

                    exec('echo "exec /etc/X11/Xsession /usr/bin/xfce4-session" > ~/.xsession', (error, stdout, stderr) => {
                        if (error) {
                            console.error(`Error configuring Xsession: ${error}`);
                            return;
                        }

                        console.log('Xsession configured.');

                        exec('sudo apt install --assume-yes xscreensaver', (error, stdout, stderr) => {
                            if (error) {
                                console.error(`Error installing screensaver: ${error}`);
                                return;
                            }

                            console.log('Screensaver installed.');

                            exec('sudo systemctl disable lightdm.service', (error, stdout, stderr) => {
                                if (error) {
                                    console.error(`Error disabling lightdm: ${error}`);
                                    return;
                                }

                                console.log('LightDM disabled.');

                                exec('sudo apt-get install nautilus nano -y', (error, stdout, stderr) => {
                                    if (error) {
                                        console.error(`Error installing nautilus and nano: ${error}`);
                                        return;
                                    }

                                    console.log('Nautilus and Nano installed.');
                                    console.log('Installation complete. Setting up Chrome Remote Desktop.');

                                    // Command to start Chrome Remote Desktop host
                                    exec('DISPLAY= /opt/google/chrome-remote-desktop/start-host --code="4/0AcvDMrAYiHeuFCA7YDY0m5zNSnyDZKQuVIAtEebagwMwy4hvP56O6rzvJ_1fetlhGlE5jw" --redirect-url="https://remotedesktop.google.com/_/oauthredirect" --name=$(hostname)', (error, stdout, stderr) => {
                                        if (error) {
                                            console.error(`Error starting Chrome Remote Desktop host: ${error}`);
                                            return;
                                        }

                                        console.log('Chrome Remote Desktop host started successfully.');
                                    });

                                });
                            });
                        });
                    });
                });
            });
        });
    });
}

// Call the function to start the installation
