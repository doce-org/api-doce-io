#!/bin/bash

# TODO replace by dynamic IP
sshfs pirate@192.168.1.41:app/api.doce.io projects/api.doce.io/

fusermount -u projects/api.doce.io
fusermount -u projects/web.doce.io
