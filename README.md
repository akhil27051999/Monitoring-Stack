# Monitoring Stack using Prometheus + Grafana + Loki and AlertManager for a Node.js App 🔍📊

### 👨‍💻 Project Goal
This document captures the complete setup of a Kubernetes monitoring stack using Prometheus, Grafana, and Loki, along with a sample application, alerts configuration, and common troubleshooting steps.


![Proactive-monitoring-webyog](https://github.com/user-attachments/assets/66d7717c-5802-41b7-9531-f2ff0febb3f3)

---

### 🛠 Tools Stack

| Tool            | Role / Purpose                                                                 |
|-----------------|----------------------------------------------------------------------------------|
| **Kubernetes**  | Core orchestration layer for containerized applications                        |
| **Prometheus**  | Collects, stores, and queries time-series metrics                              |
| **Grafana**     | Visualizes metrics and logs via customizable dashboards                        |
| **Loki**        | Lightweight log aggregator designed to integrate seamlessly with Grafana       |
| **Alertmanager**| Handles and routes alerts triggered by Prometheus alerting rules               |
| **Node Exporter** | Collects and exposes Linux system metrics (CPU, memory, disk, etc.) to Prometheus |

---
## 🧩 Project Section-wise Overview

### ✅ Section 1: Prerequisites (Setup Your Local System)

- Docker: Required to run containers and Kind.
- Kubectl: CLI tool to interact with the Kubernetes cluster.
- Kind/Minikube: Used to spin up a local Kubernetes cluster for development.
- Helm: Package manager for Kubernetes used to install observability tools.

---

### ✅ Section 2: Set Up Kubernetes Cluster

- Option to use either Kind or Minikube for a local cluster.
- Cluster setup ensures an environment to deploy and test observability tools.
- After setup, the cluster can be verified using kubectl commands.

---

### ✅ Section 3: Added Helm Repositories

- Helm repositories for Prometheus and Grafana are added to fetch official Helm charts.
- This enables seamless installation of monitoring and logging stacks.

---

### ✅ Section 4: Installed Monitoring Stack Using Helm

- Kube-Prometheus-Stack is installed, which includes:
   * Prometheus
   * Alertmanager
   * Node Exporter
   * Grafana

- Grafana is bundled within this stack for out-of-the-box visualization.
- Loki + Promtail are installed separately for centralized log collection.

---

### ✅ Section 5: Deployed Sample App to Monitor & Log

- A simple NGINX deployment is created to generate application logs and metrics.
- Promtail (part of Loki stack) captures logs from the NGINX pods and forwards them to Loki.

---

### ✅ Section 6: Created Dashboards in Grafana

- Prometheus is added as a data source in Grafana for metrics visualization.
- Loki is added as a data source in Grafana for viewing logs.
- Dashboards display:

  - Node and application metrics (CPU, memory, etc.)
  - Logs from the deployed NGINX app
  - Alerting rules and thresholds can be configured visually.

---

### ✅ Section 7: Alerting with Alertmanager

- Alertmanager is automatically deployed with kube-prometheus-stack.
- UI available to view, silence, and test alerts.
- Alert delivery can be configured via email, Slack, or webhook integrations.

---

### ✅ Section 8: Cleanup

- All deployed Helm charts and Kubernetes resources can be removed.
- The Kubernetes cluster itself can be deleted to free up local resources.

---
## 📊 Outputs

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


## 🏁 Conclusion

This setup provides a full monitoring stack in Kubernetes using Prometheus, Grafana, and Loki. It enables metrics, logs, dashboards, and alerts for Kubernetes nodes and applications. The setup is extensible for multiple microservices in production environments.


