# 🚀 Prometheus + Grafana + Loki Monitoring Stack with Sample Node.js App

This document captures the complete setup of a Kubernetes monitoring stack using Prometheus, Grafana, and Loki, along with a sample application, alerts configuration, and common troubleshooting steps.
![Proactive-monitoring-webyog](https://github.com/user-attachments/assets/66d7717c-5802-41b7-9531-f2ff0febb3f3)



## 1. **Project Goal**

To deploy a monitoring stack in a Kubernetes cluster using Prometheus for metrics, Grafana for dashboards, and Loki for logs. A sample application will be deployed and monitored using these tools. Prometheus alerts will be defined and visualized in Grafana.

---

## 2. **Cluster Setup**

* **Environment**: AWS EC2 Ubuntu instance
* **Kubernetes Installation**: Installed using kubeadm or managed service (EKS)
* **kubectl**: Configured and tested to interact with the cluster

---

## 3. **Helm Installation**

* Helm installed to manage charts:

  ```bash
  curl https://raw.githubusercontent.com/helm/helm/main/scripts/get-helm-3 | bash
  ```

* Helm repo for kube-prometheus-stack:

  ```bash
  helm repo add prometheus-community https://prometheus-community.github.io/helm-charts
  helm repo update
  ```

---

## 4. **Prometheus + Grafana Stack Installation**

### Values Configuration (`prometheus-values.yaml`)

* Enabled necessary components:

  * Prometheus
  * Grafana
  * Alertmanager
  * Node exporter
* Set service types to `NodePort` for browser access (or Ingress for production)

### Installation Command:

```bash
helm install kube-prometheus prometheus-community/kube-prometheus-stack \
  -f prometheus-values.yaml -n monitoring --create-namespace
```

---

## 5. **Grafana Access**

* Get NodePort:

  ```bash
  kubectl get svc -n monitoring grafana
  ```
* Login with default credentials:

  * Username: `admin`
  * Password: `admin123`

---

## 6. **Loki Installation**

### Values File (`loki-values.yaml`):

* Configured for simple single-instance Loki
* Enabled service discovery with Promtail

### Installation:

```bash
helm install loki grafana/loki-stack -f loki-values.yaml -n monitoring
```

---

## 7. **Custom Prometheus Alerts**

### File: `prometheus-alert.yaml`

```yaml
apiVersion: monitoring.coreos.com/v1
kind: PrometheusRule
metadata:
  name: node-alerts
  namespace: monitoring
spec:
  groups:
  - name: node_alerts
    rules:
    - alert: HighMemoryUsage
      expr: (1 - (node_memory_MemAvailable_bytes / node_memory_MemTotal_bytes)) * 100 > 80
      for: 2m
      labels:
        severity: warning
      annotations:
        summary: "High Memory usage on {{ $labels.instance }}"
        description: "Memory usage is above 80% for more than 2 minutes."

    - alert: DiskPressure
      expr: kube_node_status_condition{condition="DiskPressure",status="true"} == 1
      for: 1m
      labels:
        severity: critical
      annotations:
        summary: "Disk pressure on node {{ $labels.node }}"
        description: "Node {{ $labels.node }} is under disk pressure."

    - alert: PodCrashLooping
      expr: increase(kube_pod_container_status_restarts_total[5m]) > 3
      for: 1m
      labels:
        severity: warning
      annotations:
        summary: "Pod crash looping in {{ $labels.namespace }}"
        description: "Container {{ $labels.container }} in pod {{ $labels.pod }} restarted more than 3 times in 5 minutes."
```

### Apply Alert:

```bash
kubectl apply -f prometheus-alert.yaml
```

---

## 8. **Sample Application Deployment**

### Dockerfile for Prometheus Metrics

```dockerfile
FROM python:3.9
WORKDIR /app
COPY . .
RUN pip install flask prometheus_client
CMD ["python", "app.py"]
```

### Sample App Code: `app.py`

```python
from flask import Flask
from prometheus_client import start_http_server, Counter
import random, time

app = Flask(__name__)
REQUEST_COUNT = Counter('http_requests_total', 'Total number of HTTP requests')

@app.route('/')
def index():
    REQUEST_COUNT.inc()
    return "Hello, Prometheus!"

if __name__ == '__main__':
    start_http_server(8000)
    app.run(host='0.0.0.0', port=5000)
```

### Kubernetes Deployment YAML

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: sample-app
  labels:
    app: sample-app
spec:
  replicas: 1
  selector:
    matchLabels:
      app: sample-app
  template:
    metadata:
      labels:
        app: sample-app
    spec:
      containers:
      - name: sample-app
        image: <your-dockerhub-username>/sample-prometheus-app:latest
        ports:
        - containerPort: 5000
```

### Apply:

```bash
kubectl apply -f sample-app-deployment.yaml
```

---

## 9. **Troubleshooting Checklist**

### Pod stuck in `ContainerCreating`

* Check describe:

  ```bash
  kubectl describe pod <pod-name>
  ```
* Common causes:

  * Image not found (pull error)
  * Volume mount failure
  * Node resource limits

### Prometheus/Grafana not accessible

* Confirm NodePort is open on EC2 security group
* Use `kubectl get svc` to get correct port
* Use public IP of EC2 with NodePort

### Alerts not triggering

* Confirm rules applied:

  ```bash
  kubectl get prometheusrules -n monitoring
  ```
* Confirm alert expressions are valid using Prometheus UI `/graph`

### Grafana: Loki logs not showing

* Check if Promtail is installed and running
* Check pod logs:

  ```bash
  kubectl logs <promtail-pod>
  ```
* Verify log labels in Grafana log UI

---

## 10. **Monitoring the Sample App**

### Metrics

* Exposed at `/metrics` by `prometheus_client`
* Prometheus scrapes and makes them queryable

### Logs

* If Promtail is running, logs are picked from containers and stored in Loki
* Can be viewed in Grafana > Explore > Data Source: Loki

### Alerts

* Configured PrometheusRule fires when thresholds are met
* Alertmanager handles notifications (Slack, email, etc.) if configured

---
## Outputs

### Prometheus Outputs

**Kubernetes Stack Output**
![Screenshot 2025-05-30 104627](https://github.com/user-attachments/assets/8975cd90-df80-4a4f-a57d-90cf941aece1)

**Custom Prometheus Alert Output**
![Screenshot 2025-05-30 115808](https://github.com/user-attachments/assets/b008045a-0e64-4bd8-91d2-73b01de07efc)

**Kubernetes Pod Container Status Output**
![Screenshot 2025-05-30 120104](https://github.com/user-attachments/assets/ecfeb0f5-ff18-4746-9d1e-678d70a26405)

**Node Memory Output**
![Screenshot 2025-05-30 120005](https://github.com/user-attachments/assets/25282108-955d-4bbb-9278-e6ed150c94dc)

**Graph view of Node CPU Utilization**
![Screenshot 2025-05-30 120222](https://github.com/user-attachments/assets/3ac1eebf-8512-4bb8-bc7a-da3e7ec2742e)

### Grafana Outputs

**Grafana Dashboard**
![Screenshot 2025-05-30 005835](https://github.com/user-attachments/assets/84b2f76c-eb61-4825-81a7-04078e676f81)

**Kubernetes Compute Resources of Cluster Graph**
![Screenshot 2025-05-30 005716](https://github.com/user-attachments/assets/9f6575d1-6456-43f3-ac73-988942c7f400)

**Kubernetes Compute Resources of Node Graph**
![Screenshot 2025-05-30 010237](https://github.com/user-attachments/assets/7077711f-d9f3-4e14-8761-117e239ec6b6)

**Kubernetes Networking Namespace Graph**
![Screenshot 2025-05-30 010340](https://github.com/user-attachments/assets/1d76a6f6-8f1b-4f6d-a6de-71832e688501)

### Alerts Outputs
![Screenshot 2025-05-30 012759](https://github.com/user-attachments/assets/e5e3b1c0-2e6d-451c-8830-7b7833ceb7f6)


## Conclusion

This setup provides a full monitoring stack in Kubernetes using Prometheus, Grafana, and Loki. It enables metrics, logs, dashboards, and alerts for Kubernetes nodes and applications. The setup is extensible for multiple microservices in production environments.


