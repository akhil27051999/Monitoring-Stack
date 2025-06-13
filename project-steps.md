# Installations and Troubleshooting Steps

### 🧠 Environment Setup

- **Cloud Provider**: AWS EC2 instance (Ubuntu)
- **Access**: Ensure inbound ports for NodePort services are allowed in the EC2 security group (e.g., 3000, 9090, 3100)

---

### 🔧 Required Tools

- **Docker**: Required for containerizing and running local builds.
- **Kubernetes (kubeadm or EKS)**: Either set up a local cluster using kubeadm or use AWS EKS.
- **kubectl**: Installed and configured to interact with the Kubernetes cluster.
- **Helm**: Installed as the package manager for Kubernetes applications.
- **Git**: To clone repositories and manage version control.

---

### 1. Helm Repositories

```bash
helm repo add prometheus-community https://prometheus-community.github.io/helm-charts
helm repo add grafana https://grafana.github.io/helm-charts
helm repo update
```
---

### 2. Prometheus + Grafana Installation

```bash

helm install kube-prometheus prometheus-community/kube-prometheus-stack \
  -f prometheus-values.yaml -n monitoring --create-namespace
```
---

### 3. Grafana Access

```bash
kubectl get svc -n monitoring grafana
```

* Login with default credentials:

  * Username: `admin`
  * Password: `admin123`
    
- Use EC2 IP + NodePort to access Grafana in browser.

---

### 4. Loki + Promtail Installation

```bash
helm install loki grafana/loki-stack -f loki-values.yaml -n monitoring
```
---

### 5. Prometheus Custom Alerts

```bash
kubectl apply -f prometheus-alert.yaml
```
---

### 6. Sample App Deployment

```bash
kubectl apply -f sample-app-deployment.yaml
```
- Ensure your Docker image is pushed to Docker Hub or another registry accessible from the Kubernetes cluster.

---

### 7. Access Metrics & Logs

- Metrics: Available at /metrics on app pod
- Logs: Viewable in Grafana > Explore > Loki

---

### 8. Verify Components

```bash
kubectl get all -n monitoring
kubectl get pods
```
---

### 9. **Troubleshooting Checklist**

### - Pod stuck in `ContainerCreating`

* Check describe:

  ```bash
  kubectl describe pod <pod-name>
  ```
* Common causes:

  * Image not found (pull error)
  * Volume mount failure
  * Node resource limits

### - Prometheus/Grafana not accessible

* Confirm NodePort is open on EC2 security group
* Use `kubectl get svc` to get correct port
* Use public IP of EC2 with NodePort

### - Alerts not triggering

* Confirm rules applied:

  ```bash
  kubectl get prometheusrules -n monitoring
  ```
* Confirm alert expressions are valid using Prometheus UI `/graph`

### - Grafana: Loki logs not showing

* Check if Promtail is installed and running
* Check pod logs:

  ```bash
  kubectl logs <promtail-pod>
  ```
* Verify log labels in Grafana log UI

---

### 10. **Monitoring the Sample App**

### Metrics

* Exposed at `/metrics` by `prometheus_client`
* Prometheus scrapes and makes them queryable

### Logs

* If Promtail is running, logs are picked from containers and stored in Loki
* Can be viewed in Grafana > Explore > Data Source: Loki

### Alerts

* Configured PrometheusRule fires when thresholds are met
* Alertmanager handles notifications (Slack, email, etc.) if configured
