#!/usr/bin/env bash

# vars
PROJECT_PATH='/nodejs/fless'
NODE_VERSION='v0.10.26'

# bin NPM modules local path
echo 'export PATH=$PATH:node_modules/.bin:node_modules/bin' >> ~/.profile

# run as development env
echo "export NODE_ENV=development" >> ~/.profile

# project dir as session default
echo "cd $PROJECT_PATH" >> ~/.profile

# apply .profile changes
source ~/.profile

# take ownership of the folders that npm/node use
sudo mkdir -p /usr/local/{share/man,bin,lib/node,include/node}
sudo chown -R $USER /usr/local/{share/man,bin,lib/node,include/node}
sudo chown -R $USER $ROOT_PATH

# update apt-get
sudo apt-get update
apt-get install -y curl software-properties-common git-core
apt-get install -y libpcre3-dev build-essential libssl-dev g++ imagemagick

# install node
cd ~
wget http://nodejs.org/dist/$NODE_VERSION/node-$NODE_VERSION.tar.gz
tar -zxvf node-$NODE_VERSION.tar.gz
rm node-$NODE_VERSION.tar.gz
mv node-$NODE_VERSION /opt/node
cd /opt/node
./configure
make && make install

# grant node access to port 80
sudo apt-get install libcap2-bin
sudo setcap cap_net_bind_service=+ep /usr/local/bin/node

# install ZMQ
sudo apt-get install libtool autoconf automake uuid-dev e2fsprogs
cd ~ && git clone git://github.com/zeromq/libzmq.git && cd libzmq
./autogen.sh
./configure --with-pgm
make
sudo make install
sudo ldconfig -v
cd .. && rm -rf libzmq

# project dependencies
cd $PROJECT_PATH && npm install

# PS1 colors + git branch
curl https://gist.github.com/ricardobeat/6926021/raw/a4681e3391b3f0eb9995d46631831b9f6594067b/.profile >> ~/.profile
