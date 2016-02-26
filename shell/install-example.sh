#!/bin/bash

set -u

example=example
version=$(<VERSION)

# Install modules / packages
(
    cd ${example} || exit 1;

    # Install node modules
    npm install;

    # Install jspm packages
    jspm install --log warn -y;

    cd ..;
)

# Set up links
for directory in packages/*; do
    if [ -d "${directory}" ]; then
        package=${directory##*/}

        if [ -f "${directory}/package.json" ]; then
            # Link module / package in example
            (
                cd ${example} || exit 1;

                # Link package to npm
                npm link "${package}";

                if [[ "$package" != "react-wildcat" && "$package" != "react-wildcat-test-runners" ]]; then
                    # Link package to jspm
                    jspm install --link npm:${package}@${version} --log warn -y;
                fi
            )
        fi
    fi
done
