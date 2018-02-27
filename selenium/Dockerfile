# Build
FROM selenium/node-base:3.9.1

USER root

# VNC
RUN apt-get update -qqy \
  && apt-get -qqy install \
  x11vnc \
  && rm -rf /var/lib/apt/lists/* /var/cache/apt/*

# Locale settings
ENV LANGUAGE en_US.UTF-8
ENV LANG en_US.UTF-8
RUN locale-gen en_US.UTF-8 \
  && dpkg-reconfigure --frontend noninteractive locales \
  && apt-get update -qqy \
  && apt-get -qqy --no-install-recommends install \
    language-pack-en \
  && rm -rf /var/lib/apt/lists/* /var/cache/apt/*

# Fonts
RUN apt-get update -qqy \
  && apt-get -qqy --no-install-recommends install \
    fonts-ipafont-gothic \
    xfonts-100dpi \
    xfonts-75dpi \
    xfonts-cyrillic \
    xfonts-scalable \
  && rm -rf /var/lib/apt/lists/* /var/cache/apt/*

# fluxbox
# A fast, lightweight and responsive window manager
RUN apt-get update -qqy \
  && apt-get -qqy install \
    fluxbox \
  && rm -rf /var/lib/apt/lists/* /var/cache/apt/*

# Generating the VNC password as seluser
# So the service can be started with seluser
USER seluser
RUN mkdir -p ~/.vnc \
  && x11vnc -storepasswd password ~/.vnc/passwd

# Scripts to run Selenium Node
COPY entry_point.sh /opt/bin/entry_point.sh

EXPOSE 5900

# Firefox
USER root
RUN apt-get update -qqy \
  && apt-get -qqy --no-install-recommends install firefox \
  && rm -rf /var/lib/apt/lists/* /var/cache/apt/* \
  && wget -qO- "https://download.mozilla.org/?product=firefox-devedition-latest-ssl&os=linux64&lang=en-US" | tar -C /opt -xj \
  && mv /opt/firefox /opt/firefox-devedition \
  && ln -fs /opt/firefox-devedition/firefox /usr/bin/firefox

# GeckoDriver
RUN apt-get update -qqy \
  && apt-get -qqy --no-install-recommends install \
    jq \
  && rm -rf /var/lib/apt/lists/* /var/cache/apt/* \
  && GK_VERSION=$(wget -qO- "https://api.github.com/repos/mozilla/geckodriver/releases/latest" | jq --raw-output .tag_name | tr --delete v) \
  && apt-get purge -qqy jq \
  && wget -qO- https://github.com/mozilla/geckodriver/releases/download/v$GK_VERSION/geckodriver-v$GK_VERSION-linux64.tar.gz | tar -C /opt -zx \
  && mv /opt/geckodriver /opt/geckodriver-$GK_VERSION \
  && chmod 755 /opt/geckodriver-$GK_VERSION \
  && ln -fs /opt/geckodriver-$GK_VERSION /usr/bin/geckodriver

USER seluser

COPY generate_config.sh /opt/bin/generate_config.sh

# Generating a default config during build time
RUN /opt/bin/generate_config.sh > /opt/selenium/config.json
