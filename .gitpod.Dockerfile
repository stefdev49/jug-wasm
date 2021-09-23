# station de travail complète : workspace-full, et avec vnc en plus sur port 6080
FROM gitpod/workspace-full-vnc:latest

# Install custom tools, runtimes, etc.
# For example "bastet", a command-line tetris clone:
# RUN brew install bastet
# https://www.gitpod.io/docs/languages/javascript
RUN bash -c ". .nvm/nvm.sh && nvm install 14 && nvm use 14 && nvm alias default 14"
RUN echo "nvm use default &>/dev/null" >> ~/.bashrc.d/51-nvm-fix

## on installe gvim :-) pour avoir au moins un outil graphique
RUN sudo apt-get update -y && sudo apt-get install -y vim-gtk3
