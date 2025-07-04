## ✅ Section 1: Provisioning Local System for Observability

### 🔍 Concept: Local Dev Environment for Kubernetes Monitoring

* Instead of using a cloud VM, we simulate the environment locally using Docker and Kind.
* Acts as a base platform for deploying Prometheus, Grafana, Loki, and sample apps.

### 🔧 Key Tools

| Tool    | Purpose                                                 |
| ------- | ------------------------------------------------------- |
| Docker  | Required by Kind to run Kubernetes in Docker containers |
| kubectl | CLI for interacting with Kubernetes cluster             |
| Kind    | Creates local K8s cluster using Docker                  |
| Helm    | Installs complex apps via reusable charts               |

### 🔌 Install & Verify

```bash
# Docker
sudo apt install docker.io -y
sudo systemctl start docker && sudo systemctl enable docker
docker --version

# kubectl
curl -LO https://dl.k8s.io/release/$(curl -L -s https://dl.k8s.io/release/stable.txt)/bin/linux/amd64/kubectl
chmod +x kubectl && sudo mv kubectl /usr/local/bin/
kubectl version --client

# Kind
curl -Lo ./kind https://kind.sigs.k8s.io/dl/v0.22.0/kind-linux-amd64
chmod +x ./kind && sudo mv ./kind /usr/local/bin/kind
kind version

# Helm
curl https://raw.githubusercontent.com/helm/helm/master/scripts/get-helm-3 | bash
helm version
```

---

## ✅ Section 2: Creating Kubernetes Cluster with Kind

### 📌 Concept: Kubernetes Cluster Provisioning

* Local, Docker-based Kubernetes cluster using Kind.

### 🛠️ Create & Verify

```bash
kind create cluster --name observability
kubectl cluster-info
kubectl get nodes
```

### 🧯 Troubleshooting

| Issue              | Solution                        |
| ------------------ | ------------------------------- |
| Docker not running | `sudo systemctl start docker`   |
| Kind fails         | Delete and recreate the cluster |

---

## ✅ Section 3: Adding Helm Repositories

### 🎯 Concept: Helm Chart Source Configuration

* Helm uses repositories to fetch application charts.

### 🔧 Commands

```bash
helm repo add prometheus-community https://prometheus-community.github.io/helm-charts
helm repo add grafana https://grafana.github.io/helm-charts
helm repo update
```

---

## ✅ Section 4: Installing Prometheus + Grafana Monitoring Stack

### 📊 Concept: Cluster Monitoring

* `kube-prometheus-stack` offers Prometheus, Grafana, Alertmanager, Node Exporter, etc.

### 🛠️ Install

```bash
kubectl create namespace monitoring
helm install kube-prom-stack prometheus-community/kube-prometheus-stack --namespace monitoring
```

### ✅ Verify

```bash
kubectl get pods -n monitoring
kubectl get svc -n monitoring
```

### 🧯 Troubleshooting

| Problem             | Solution                             |
| ------------------- | ------------------------------------ |
| Pod not running     | `kubectl describe pod` or check logs |
| Helm install failed | `helm uninstall` then reinstall      |

---

## ✅ Section 5: Installing Loki + Promtail (Logging Stack)

### 🗂️ Concept: Centralized Logging

* Loki stores logs, Promtail scrapes container logs.

### 🛠️ Install

```bash
helm install loki grafana/loki-stack --namespace monitoring
```

### ✅ Verify

```bash
kubectl get pods -n monitoring | grep loki
kubectl get daemonsets -n monitoring | grep promtail
```

### 🧯 Troubleshooting

| Issue                  | Solution                     |
| ---------------------- | ---------------------------- |
| Logs not showing in UI | Check Promtail logs & labels |

---

## ✅ Section 6: Deploying Sample App (NGINX)

### 📦 Concept: Metrics & Log Generation

* Simple app to generate logs and test observability stack.

### 🛠️ Deploy & Expose

```bash
kubectl create deployment nginx --image=nginx
kubectl expose deployment nginx --port=80 --type=NodePort
```

### ✅ Verify

```bash
kubectl get pods,svc
kubectl logs -l app=nginx
```

---

## ✅ Section 7: Setting up Grafana Dashboards

### 📺 Concept: Visualize Metrics and Logs

### 🛠️ Access Grafana

```bash
kubectl port-forward svc/kube-prom-stack-grafana -n monitoring 3000:80
```

* Open `http://localhost:3000`
* Default credentials: `admin / prom-operator`

### ➕ Add Data Sources

* Prometheus URL: `http://kube-prom-stack-prometheus.monitoring.svc:9090`
* Loki URL: `http://loki.monitoring.svc.cluster.local:3100`

---

## ✅ Section 8: Configuring Alertmanager

### 🔔 Concept: Trigger & Route Alerts

### 🛠️ Access Alertmanager

```bash
kubectl port-forward svc/kube-prom-stack-alertmanager -n monitoring 9093:9093
```

* Open `http://localhost:9093`
* Configure alert rules in PrometheusRule CRD

---

## ✅ Section 9: Cleanup

### ♻️ Commands

```bash
helm uninstall kube-prom-stack -n monitoring
helm uninstall loki -n monitoring
kubectl delete deployment nginx
kubectl delete service nginx
kubectl delete namespace monitoring
kind delete cluster --name observability
```

---

# 🔧 Troubleshooting Summary

| Issue                    | Cause                        | Solution                   |
| ------------------------ | ---------------------------- | -------------------------- |
| Pod CrashLoopBackOff     | App failure or config error  | `kubectl logs <pod>`       |
| Port-forward not working | Service not exposed properly | Check `kubectl get svc`    |
| Promtail not shipping    | Volume or path issue         | Check DaemonSet + Pod logs |

---

# 📃 Final Commands Summary (Chronological)

```bash
# Install tools
sudo apt install docker.io -y
curl -LO https://dl.k8s.io/release/$(curl -L -s https://dl.k8s.io/release/stable.txt)/bin/linux/amd64/kubectl
chmod +x kubectl && sudo mv kubectl /usr/local/bin/
curl -Lo ./kind https://kind.sigs.k8s.io/dl/v0.22.0/kind-linux-amd64
chmod +x ./kind && sudo mv ./kind /usr/local/bin/kind
curl https://raw.githubusercontent.com/helm/helm/master/scripts/get-helm-3 | bash

# Create Cluster
kind create cluster --name observability

# Add Repos
helm repo add prometheus-community https://prometheus-community.github.io/helm-charts
helm repo add grafana https://grafana.github.io/helm-charts
helm repo update

# Install Monitoring
kubectl create namespace monitoring
helm install kube-prom-stack prometheus-community/kube-prometheus-stack --namespace monitoring
helm install loki grafana/loki-stack --namespace monitoring

# Sample App
kubectl create deployment nginx --image=nginx
kubectl expose deployment nginx --port=80 --type=NodePort

# Access UIs
kubectl port-forward svc/kube-prom-stack-grafana -n monitoring 3000:80
kubectl port-forward svc/kube-prom-stack-alertmanager -n monitoring 9093:9093

# Cleanup
helm uninstall kube-prom-stack -n monitoring
helm uninstall loki -n monitoring
kubectl delete deployment nginx
kubectl delete service nginx
kubectl delete namespace monitoring
kind delete cluster --name observability
```


## 🧯 Troubleshooting Checklist

### I. Pod stuck in `ContainerCreating`

* Check describe:

  ```bash
  kubectl describe pod <pod-name>
  ```
* Common causes:

  * Image not found (pull error)
  * Volume mount failure
  * Node resource limits

---

### II. Prometheus/Grafana not accessible

* Confirm NodePort is open on EC2 security group
* Use `kubectl get svc` to get correct port
* Use public IP of EC2 with NodePort

---

### III. Alerts not triggering

* Confirm rules applied:

  ```bash
  kubectl get prometheusrules -n monitoring
  ```
* Confirm alert expressions are valid using Prometheus UI `/graph`

---

### IV. Grafana: Loki logs not showing

* Check if Promtail is installed and running
* Check pod logs:

  ```bash
  kubectl logs <promtail-pod>
  ```
* Verify log labels in Grafana log UI

