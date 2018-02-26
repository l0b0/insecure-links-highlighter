FROM gradle:jdk8

USER root
WORKDIR /home/gradle/project
COPY . .
RUN chown --recursive gradle:gradle .

USER gradle
