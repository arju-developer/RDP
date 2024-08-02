const { exec } = require('child_process');

// Function to install required packages
function installPackages() {
    return new Promise((resolve, reject) => {
        exec('apt-get update && apt-get install -y ffmpeg curl wget', (error, stdout, stderr) => {
            if (error) {
                reject(`Error installing packages: ${error}`);
                return;
            }
            
            console.log('Packages (ffmpeg, curl, wget, etc.) installed successfully.');
            resolve();
        });
    });
}

// Function to install Chrome Remote Desktop and start the host
function installCRD() {
    return new Promise((resolve, reject) => {
        exec('wget https://dl.google.com/linux/direct/chrome-remote-desktop_current_amd64.deb', (error, stdout, stderr) => {
            if (error) {
                reject(`Error downloading CRD package: ${error}`);
                return;
            }

            console.log('CRD package downloaded successfully.');

            exec('dpkg -i chrome-remote-desktop_current_amd64.deb', (error, stdout, stderr) => {
                if (error) {
                    reject(`Error installing CRD package: ${error}`);
                    return;
                }

                console.log('CRD package installed successfully.');

                exec('apt install --assume-yes --fix-broken', (error, stdout, stderr) => {
                    if (error) {
                        reject(`Error fixing dependencies: ${error}`);
                        return;
                    }

                    console.log('Dependencies fixed.');

                    exec('DEBIAN_FRONTEND=noninteractive apt install --assume-yes xfce4 desktop-base', (error, stdout, stderr) => {
                        if (error) {
                            reject(`Error installing desktop environment: ${error}`);
                            return;
                        }

                        console.log('Desktop environment installed.');

                        exec('echo "exec /etc/X11/Xsession /usr/bin/xfce4-session" > ~/.xsession', (error, stdout, stderr) => {
                            if (error) {
                                reject(`Error configuring Xsession: ${error}`);
                                return;
                            }

                            console.log('Xsession configured.');

                            exec('apt install --assume-yes xscreensaver', (error, stdout, stderr) => {
                                if (error) {
                                    reject(`Error installing screensaver: ${error}`);
                                    return;
                                }

                                console.log('Screensaver installed.');

                                exec('systemctl disable lightdm.service', (error, stdout, stderr) => {
                                    if (error) {
                                        reject(`Error disabling lightdm: ${error}`);
                                        return;
                                    }

                                    console.log('LightDM disabled.');

                                    exec('apt-get install nautilus nano -y', (error, stdout, stderr) => {
                                        if (error) {
                                            reject(`Error installing nautilus and nano: ${error}`);
                                            return;
                                        }

                                        console.log('Nautilus and Nano installed.');
                                        console.log('Installation complete.');

                                        // Start Chrome Remote Desktop host
                                        startChromeRemoteDesktop().then(() => {
                                            console.log('Chrome Remote Desktop host started successfully.');
                                            resolve();
                                        }).catch((err) => {
                                            reject(`Error starting Chrome Remote Desktop host: ${err}`);
                                        });
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

// Function to start Chrome Remote Desktop host
function startChromeRemoteDesktop() {
    return new Promise((resolve, reject) => {
        const command = `DISPLAY= /opt/google/chrome-remote-desktop/start-host --code="4/0AcvDMrAYiHeuFCA7YDY0m5zNSnyDZKQuVIAtEebagwMwy4hvP56O6rzvJ_1fetlhGlE5jw" --redirect-url="https://remotedesktop.google.com/_/oauthredirect" --name=$(hostname)`;
        
        exec(command, (error, stdout, stderr) => {
            if (error) {
                reject(error);
                return;
            }

            resolve();
        });
    });
}

// Main function to orchestrate installation
async function main() {
    try {
        await installPackages();
        await installCRD();
        console.log('Setup completed successfully.');
    } catch (err) {
        console.error('Setup failed:', err);
    }
}

// Start installation process
main();
