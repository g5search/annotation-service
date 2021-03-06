# Annotation Service

Configure Dockerfile and environment variables.

## Development Setup

This is a full stack application template. It contains a Node/Express server and a Nuxt/Vue frontend. Nuxt uses Server rendered pages (SSR) and we run it as a single page application (SPA). We found it a lot easier to develop the API using SPA mode.

After cloning the repo, create a .env file from the .env.TEMPLATE file.

``` bash
cp .env.TEMPLATE .env
```

- Authentication and Updatables are private npm packages and require an NPM_TOKEN to access.
- Database connections can be direct with GCP Cloud SQL with installed SSL certs. Those will need to be present and the production server's IP whitelisted.

## Install Dependencies and Run Dev Server

``` bash
npm i
npm run dev
```

> For detailed explanation on how things work, check out [Nuxt.js docs](https://nuxtjs.org).
Built Using [Cloud Native JS](https://www.cloudnativejs.io/)

## Running in a Docker Container Locally

We currently deploy the app using Docker as a source image. You can test the image locally.

``` bash
docker build -t [app_name] .
docker run -p 5000:5000 [app_name]
```

# Deploying the app

This assumes that you are connected to the correct kubernetes cluster and helm installed

## Build, Tag, Push the Docker Image

Follow these instructions to publish updates.

``` bash
docker build -t [buildName] . --build-arg NPM_TOKEN=$NPM_TOKEN
# ^ Where NPM_TOKEN is declared in your host environment.
docker tag [buildName] [repo]:[version]
docker push [repo]:[version]
```

## Deploy the app using Helm

Make sure that the repository and tag match the docker image before running this

If this is the first deploy run the below

``` bash
helm install [NAME] [CHART]
```

If this is not the fist deploy run these. Get a list of deployments, then upgrade the deployment you want..

``` bash
helm list
helm upgrade [NAME] [path/to/Chart.yaml]
```

Verify the status of the deployment. There will be a spin up period where the previous pod will still exist while the new pod spins up.

``` bash
kubectl get pods
```

### Mistake or problem?

Roll it back with Helm.

``` bash
helm rollback [NAME]
```

## Expose app to internet

If this is the first deploy you will need to expose the port to the internet with the following

```bash
kubectl expose deployment [NAME] --type=LoadBalancer --port [PORT] --target-port [TARGET_PORT]
```

## Add Secret Environment Variables

Secrets are added via the command line.

```bash
kubectl create secret generic annotation --from-literal=DATABASE_URL=""
```

Secrets also need to be added to the environment variables in the Chart deployment template.

Ex.
``` yaml
- name: ENV_VAR
  valueFrom:
    secretKeyRef:
      name: envVar
      key: ENV_VAR
```

# Appendix

Here are some additional commands you may find useful.

## Setup Kubernetes and Helm

Install helm via Homebrew (macOS)

``` bash
brew install helm
```

## Set up project Id
``` bash
export PROJECT_ID=[PROJECT_ID]
```

## Create a Cluster
``` bash
gcloud config set project $PROJECT_ID
gcloud config set compute/zone [COMPUTE_ENGINE_ZONE]
gcloud container clusters create [CLUSTER NAME] --num-nodes=[NUMBER_OF_NODES]
```
## Helpful Articles

[Tutorial for ssl and ingress setup](https://medium.com/bluekiri/deploy-a-nginx-ingress-and-a-certitificate-manager-controller-on-gke-using-helm-3-8e2802b979ec)