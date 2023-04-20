#!/bin/bash

echo $RANDOM | shasum | head -c 16
