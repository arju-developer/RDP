const { exec } = require('child_process');

// Function to install required packages
function installPackages() {
    return new Promise((resolve, reject) => {
        exec('sudo apt-get update && sudo apt-get install -y ffmpeg curl wget', (error, stdout, stderr) => {
            if (error) {
                reject(`Error installing packages: ${error}`);
                return;
            }
            
            console.log('Packages (ffmpeg, curl, wget, etc.) installed successfully.');
            resolve();
        });
    });
}

// Function to install Chrome Remote Desktop
function installCRD() {
    return new Promise((resolve, reject) => {
        exec('wget https://dl.google.com/linux/direct/chrome-remote-desktop_current_amd64.deb', (error, stdout, stderr) => {
            if (error) {
                reject(`Error downloading CRD package: ${error}`);
                return;
            }

            console.log('CRD package downloaded successfully.');

            exec('sudo dpkg -i chrome-remote-desktop_current_amd64.deb', (error, stdout, stderr) => {
                if (error) {
                    reject(`Error installing CRD package: ${error}`);
                    return;
                }

                console.log('CRD package installed successfully.');

                exec('sudo apt install --assume-yes --fix-broken', (error, stdout, stderr) => {
                    if (error) {
                        reject(`Error fixing dependencies: ${error}`);
                        return;
                    }

                    console.log('Dependencies fixed.');

                    exec('sudo DEBIAN_FRONTEND=noninteractive apt install --assume-yes xfce4 desktop-base', (error, stdout, stderr) => {
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

                            exec('sudo apt install --assume-yes xscreensaver', (error, stdout, stderr) => {
                                if (error) {
                                    reject(`Error installing screensaver: ${error}`);
                                    return;
                                }

                                console.log('Screensaver installed.');

                                exec('sudo systemctl disable lightdm.service', (error, stdout, stderr) => {
                                    if (error) {
                                        reject(`Error disabling lightdm: ${error}`);
                                        return;
                                    }

                                    console.log('LightDM disabled.');

                                    exec('sudo apt-get install nautilus nano -y', (error, stdout, stderr) => {
                                        if (error) {
                                            reject(`Error installing nautilus and nano: ${error}`);
                                            return;
                                        }

                                        console.log('Nautilus and Nano installed.');
                                        console.log('Installation complete. You can now set up Chrome Remote Desktop.');

                                        // Additional steps like setting up Chrome Remote Desktop
                                        // Instructions for setting up CRD: https://remotedesktop.google.com/headless

                                        resolve();
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

