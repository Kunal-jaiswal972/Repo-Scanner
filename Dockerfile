# Dockerfile
FROM alpine:3.14

# Install dependencies: git and wget
RUN apk add --no-cache git wget

# Download and install Gitleaks
RUN wget https://github.com/gitleaks/gitleaks/releases/download/v8.14.0/gitleaks_8.14.0_linux_x64.tar.gz && \
    tar -xvzf gitleaks_8.14.0_linux_x64.tar.gz && \
    mv gitleaks /usr/local/bin/ && \
    rm gitleaks_8.14.0_linux_x64.tar.gz  
    
# Create a directory for the repository
WORKDIR /app

# Clone the repository and run gitleaks
ENTRYPOINT ["/bin/sh", "-c"]
