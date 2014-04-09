#!/usr/bin/env bash

# vars
PROJECT_PATH='/nodejs/fless'
NODE_VERSION='v0.10.26'

# bin NPM modules local path
echo 'export PATH=$PATH:node_modules/.bin:node_modules/bin' >> ~/.profile
source ~/.profile

# Fix permissions for NPM
chgrp -R vagrant /usr/local
chmod -R g+w /usr/local

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
apt-get install libcap2-bin
sudo setcap cap_net_bind_service=+ep /usr/local/bin/node

# install ZMQ
sudo apt-get install libtool autoconf automake uuid-dev e2fsprogs
cd ~ && git clone git://github.com/zeromq/libzmq.git && cd libzmq
./autogen.sh
./configure
make
sudo make install
sudo ldconfig -v
cd .. && rm -rf libzmq

# install mongodb
apt-get install -y mongodb-10gen=$MONGO_VERSION

# project dependencies
cd $PROJECT_PATH && npm install

# PS1 colors + git branch
curl https://gist.github.com/ricardobeat/6926021/raw/a4681e3391b3f0eb9995d46631831b9f6594067b/.profile >> ~/.profile
