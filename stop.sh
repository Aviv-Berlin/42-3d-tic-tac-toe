#!/bin/bash

kill $(cat .backend.pid);
kill $(cat .frontend1.pid);
kill $(cat .frontend2.pid);

rm .{backend,frontend{1,2}}.pid;
