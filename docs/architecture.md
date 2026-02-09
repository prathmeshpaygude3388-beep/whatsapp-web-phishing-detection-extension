# System Architecture

## Overview

This project implements a real-time phishing detection system for WhatsApp Web using a browser extension and a multi-layer detection engine. Since WhatsApp does not allow third-party plugins in its native applications, the system operates by analyzing URLs received on WhatsApp Web through DOM inspection.

The architecture follows a modular, defense-in-depth approach to ensure scalability, explainability, and real-world applicability.

---

## High-Level Architecture

WhatsApp Web  
↓  
Content Script (DOM Observer & URL Extractor)  
↓  
Background Service Worker  
↓  
Detection Engine  
↓  
Attack Classifier  
↓  
Alerting & Storage  
↓  
User Notification & Popup Dashboard

---

## Component Breakdown

### 1. Content Layer
- Monitors WhatsApp Web chat DOM using `MutationObserver`
- Extracts URLs from new and existing messages
- Avoids duplicate scans
- Sends URLs to background service worker

### 2. Background Layer
- Acts as the central coordinator
- Receives URLs from content scripts
- Invokes the detection engine
- Returns analysis results
- Triggers alerts when required

### 3. Detection Engine
Implements multi-layer analysis:
- URL structural heuristics
- Redirect analysis
- SSL / HTTPS behavior analysis
- Domain age inference
- Brand impersonation detection
- Behavioral (credential harvesting) analysis
- Machine learning risk amplification

Each module contributes:
- Risk score
- Explainable reasons
- Detection signals

### 4. Attack Classifier
- Correlates all signals and final risk score
- Assigns one definitive attack type
- Prevents alert flooding and false positives

### 5. Alerting & Storage
- Displays browser notifications
- Explains why a link was flagged
- Stores statistics and recent detections locally
- Feeds popup dashboard

---

## Design Principles

- Modular & extensible
- Dataset-independent at runtime
- Browser-safe and privacy-preserving
- Explainable security decisions
- Aligned with real-world SOC practices

---

## Security & Privacy

- No message content is stored
- URLs analyzed locally
- No external APIs required
- Defensive research use only
