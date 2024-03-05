FROM node:20.9.0-bullseye

# set working directory
WORKDIR /app

# add `/app/node_modules/.bin` to $PATH
ENV PATH /app/node_modules/.bin:$PATH

# add app
COPY . /app

# install and cache app dependencies
#COPY package.json /app/package.json
RUN npm install
#RUN npm install -g @angular/cli@17.1.0
EXPOSE 4200
# start app
CMD ng serve --host 0.0.0.0

# FOLLOWING FOR PRODUCTION POSSIBLY
# # Stage 1: Build the Angular app
# FROM node:14 as build
# WORKDIR /app
# COPY package.json package-lock.json ./
# RUN npm install
# COPY . .
# RUN npm run build

# # Stage 2: Serve the app with nginx
# FROM nginx:1.19
# COPY --from=build /app/dist/ /usr/share/nginx/html
# COPY ./nginx-custom.conf /etc/nginx/conf.d/default.conf
