FROM vm/ubuntu:18.04


RUN apt-get update && \
    apt-get install ca-certificates curl gnupg lsb-release && \
    sudo mkdir -p /etc/apt/keyrings && \
    curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /etc/apt/keyrings/docker.gpg && \
    echo \
    "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.gpg] https://download.docker.com/linux/ubuntu $(lsb_release -cs) stable" |\
      sudo tee /etc/apt/sources.list.d/docker.list > /dev/null && \
    apt-get update && \
    apt-get install docker-ce docker-ce-cli containerd.io

COPY . .

RUN docker build -t image .
RUN docker run -d -p 5000:5000 image
EXPOSE WEBSITE http://localhost:5000 
