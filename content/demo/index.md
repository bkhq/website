---
title:
  en: Introduction
  zh: 简介
order: 0
---

## Overview

Image Compressor is a lightweight desktop application that reduces the file size of your PNG, JPG, and WebP images without losing visible quality. All processing happens locally on your machine — your files never leave your device.

Built with performance in mind, Image Compressor leverages modern compression algorithms including MozJPEG, OptiPNG, and libwebp to achieve optimal file size reduction while preserving visual fidelity. Whether you're a web developer optimizing assets, a photographer managing large libraries, or anyone who needs smaller image files, this tool provides a simple drag-and-drop workflow.

### Key Features

- **Batch Processing** — Compress hundreds of images at once with parallel processing. Simply drag a folder onto the app and let it handle the rest.
- **Smart Quality Detection** — Automatically analyzes each image and selects the optimal compression level. No manual tweaking required for most use cases.
- **Format Conversion** — Convert between PNG, JPG, and WebP formats during compression. Easily migrate your entire image library to modern WebP format.
- **Lossless Mode** — When every pixel matters, enable lossless mode to reduce file size without any quality degradation.
- **Watch Mode** — Monitor folders for new images and compress them automatically as they appear.
- **EXIF Data Control** — Choose to preserve or strip metadata. Remove GPS coordinates for privacy while keeping camera settings.

### How It Works

Image Compressor uses a multi-stage pipeline to process your images:

1. **Analysis** — The image is loaded and analyzed for color depth, transparency, and complexity. This determines which compression strategy will be most effective.
2. **Pre-processing** — Optional steps like resizing, color profile conversion (sRGB normalization), and alpha channel optimization are applied.
3. **Compression** — The appropriate encoder processes the image using the selected quality settings. For JPEG, MozJPEG provides superior compression compared to standard libraries. For PNG, OptiPNG finds the optimal filter and compression parameters. For WebP, Google's libwebp encoder handles both lossy and lossless modes.
4. **Verification** — The output is compared against the original to ensure quality thresholds are met. If the compressed file is somehow larger than the original, the original is kept.

### Supported Formats

| Format | Input | Output | Notes |
|--------|-------|--------|-------|
| JPEG/JPG | Yes | Yes | Progressive JPEG support |
| PNG | Yes | Yes | 8-bit and 24-bit with alpha |
| WebP | Yes | Yes | Lossy and lossless modes |
| AVIF | Yes | No | Read-only, convert to other formats |
| GIF | Yes | No | Static frames only |

### System Requirements

- **macOS** 12.0 or later (Universal Binary — Apple Silicon and Intel)
- **Windows** 10 version 1903 or later (64-bit)
- **Linux** — Ubuntu 20.04+, Fedora 36+, or equivalent (x86_64 and arm64)
- Minimum 4 GB RAM (8 GB recommended for batch processing)
- 100 MB disk space for installation

---

## 概述

图片压缩器是一款轻量级桌面应用，可以在不损失可见质量的情况下减小 PNG、JPG 和 WebP 图片的文件大小。所有处理都在本地完成——你的文件永远不会离开你的设备。

图片压缩器以性能为核心设计，利用 MozJPEG、OptiPNG 和 libwebp 等现代压缩算法，在保持视觉保真度的同时实现最佳的文件大小缩减。无论你是优化资源的 Web 开发者、管理大量图片库的摄影师，还是任何需要更小图片文件的人，这款工具都提供了简单的拖放式工作流程。

### 主要功能

- **批量处理** — 通过并行处理一次压缩数百张图片。只需将文件夹拖到应用上，让它处理剩下的工作。
- **智能质量检测** — 自动分析每张图片并选择最佳压缩级别。大多数情况下无需手动调整。
- **格式转换** — 在压缩过程中转换 PNG、JPG 和 WebP 格式。轻松将整个图片库迁移到现代 WebP 格式。
- **无损模式** — 当每个像素都很重要时，启用无损模式可在不降低任何质量的情况下减小文件大小。
- **监视模式** — 监控文件夹中的新图片，并在出现时自动压缩。
- **EXIF 数据控制** — 选择保留或删除元数据。删除 GPS 坐标以保护隐私，同时保留相机设置。

### 工作原理

图片压缩器使用多阶段管道处理你的图片：

1. **分析** — 加载并分析图片的色深、透明度和复杂度，以确定最有效的压缩策略。
2. **预处理** — 应用可选步骤，如调整大小、颜色配置文件转换（sRGB 标准化）和 Alpha 通道优化。
3. **压缩** — 使用所选质量设置处理图片。JPEG 使用 MozJPEG，PNG 使用 OptiPNG，WebP 使用 Google 的 libwebp 编码器。
4. **验证** — 将输出与原始文件进行比较，确保满足质量阈值。如果压缩文件比原始文件大，则保留原始文件。

### 支持的格式

| 格式 | 输入 | 输出 | 备注 |
|------|------|------|------|
| JPEG/JPG | 支持 | 支持 | 支持渐进式 JPEG |
| PNG | 支持 | 支持 | 8 位和 24 位（含 Alpha） |
| WebP | 支持 | 支持 | 有损和无损模式 |
| AVIF | 支持 | 不支持 | 仅读取，转换为其他格式 |
| GIF | 支持 | 不支持 | 仅静态帧 |

### 系统要求

- **macOS** 12.0 或更高版本（通用二进制 — 支持 Apple Silicon 和 Intel）
- **Windows** 10 1903 版本或更高（64 位）
- **Linux** — Ubuntu 20.04+、Fedora 36+ 或同等版本（x86_64 和 arm64）
- 最低 4 GB 内存（批量处理建议 8 GB）
- 100 MB 磁盘空间用于安装
