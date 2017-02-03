# Docker container, based on node 7 and with libusb-dev
# to be able to use the npm package 'usb'

FROM node:7

RUN apt-get update && apt-get install -y build-essential libudev-dev
