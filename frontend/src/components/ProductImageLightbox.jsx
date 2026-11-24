import React, { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion as Motion } from "framer-motion";
import {
  LuChevronLeft,
  LuChevronRight,
  LuX,
  LuZoomIn,
  LuZoomOut,
} from "react-icons/lu";
import { getOptimizedUrl } from "../utils/cloudinaryHelper";

const clamp = (value, min, max) => Math.min(Math.max(value, min), max);

const ProductImageLightbox = ({
  isOpen,
  images = [],
  currentIndex = 0,
  productName = "Product",
  onClose,
  onSelectIndex,
}) => {
  const [isZoomed, setIsZoomed] = useState(false);
  const [isPanning, setIsPanning] = useState(false);
  const [zoomOrigin, setZoomOrigin] = useState({ x: 50, y: 50 });
  const [loadedUrl, setLoadedUrl] = useState("");

  const dialogRef = useRef(null);
  const closeButtonRef = useRef(null);
  const imageWrapperRef = useRef(null);
  const imgRef = useRef(null);
  const thumbnailRefs = useRef([]);
  const swipeStartRef = useRef(null);
  const panStartRef = useRef(null);
  const didPanRef = useRef(false);
  const lastPanAtRef = useRef(0);

  const imageCount = images.length;
  const safeIndex =
    imageCount > 0 ? ((currentIndex % imageCount) + imageCount) % imageCount : 0;
  const hasMultiple = imageCount > 1;
  const currentImage = images[safeIndex];
  const fullUrl = currentImage?.url ? getOptimizedUrl(currentImage.url, 1600) : "";

  const selectImage = useCallback(
    (idx) => {
      setIsZoomed(false);
      setIsPanning(false);
      setZoomOrigin({ x: 50, y: 50 });
      onSelectIndex(idx);
    },
    [onSelectIndex],
  );

  const goToPrev = useCallback(() => {
    if (!hasMultiple) return;
    selectImage((safeIndex - 1 + imageCount) % imageCount);
  }, [hasMultiple, imageCount, safeIndex, selectImage]);

  const goToNext = useCallback(() => {
    if (!hasMultiple) return;
    selectImage((safeIndex + 1) % imageCount);
  }, [hasMultiple, imageCount, safeIndex, selectImage]);

  // Reset zoom and pan whenever the active image changes or lightbox closes.
  useEffect(() => {
    setIsZoomed(false);
    setIsPanning(false);
    setZoomOrigin({ x: 50, y: 50 });
  }, [safeIndex, isOpen]);

  // Detect already-cached images immediately.
  useEffect(() => {
    if (!isOpen || !fullUrl) return;
    if (imgRef.current?.complete && imgRef.current?.naturalWidth > 0) {
      setLoadedUrl(fullUrl);
    }
  }, [isOpen, fullUrl]);

  // Preload adjacent images for smoother browsing.
  useEffect(() => {
    if (!isOpen || !hasMultiple) return;
    const prevIdx = (safeIndex - 1 + imageCount) % imageCount;
    const nextIdx = (safeIndex + 1) % imageCount;

    [prevIdx, nextIdx].forEach((idx) => {
      const rawUrl = images[idx]?.url;
      if (!rawUrl) return;
      const preloader = new Image();
      preloader.src = getOptimizedUrl(rawUrl, 1600);
    });
  }, [isOpen, hasMultiple, safeIndex, imageCount, images]);

  // Scroll the active thumbnail into view in the bottom strip.
  useEffect(() => {
    if (!isOpen || !hasMultiple) return;
    const activeThumb = thumbnailRefs.current[safeIndex];
    activeThumb?.scrollIntoView({
      behavior: "smooth",
      inline: "center",
      block: "nearest",
    });
  }, [isOpen, hasMultiple, safeIndex]);

  // Lock page scroll and manage focus lifecycle when opening/closing.
  useEffect(() => {
    if (!isOpen) return undefined;

    const previousOverflow = document.body.style.overflow;
    const previouslyFocused = document.activeElement;
    document.body.style.overflow = "hidden";

    const focusTimer = window.requestAnimationFrame(() => {
      closeButtonRef.current?.focus();
    });

    return () => {
      window.cancelAnimationFrame(focusTimer);
      document.body.style.overflow = previousOverflow;
      if (previouslyFocused && previouslyFocused.isConnected) {
        previouslyFocused.focus?.();
      }
    };
  }, [isOpen]);

  // Keyboard shortcuts (Esc, Left/Right arrows, Tab focus trap).
  useEffect(() => {
    if (!isOpen) return undefined;

    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        e.preventDefault();
        onClose();
        return;
      }

      if (e.key === "ArrowLeft") {
        if (hasMultiple) {
          e.preventDefault();
          goToPrev();
        }
        return;
      }

      if (e.key === "ArrowRight") {
        if (hasMultiple) {
          e.preventDefault();
          goToNext();
        }
        return;
      }

      if (e.key === "Tab" && dialogRef.current) {
        const focusables = dialogRef.current.querySelectorAll(
          'button:not([disabled]), [href], [tabindex]:not([tabindex="-1"])',
        );
        if (focusables.length === 0) return;

        const first = focusables[0];
        const last = focusables[focusables.length - 1];

        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, hasMultiple, goToPrev, goToNext, onClose]);

  const getRelativePoint = (clientX, clientY) => {
    const rect = imageWrapperRef.current?.getBoundingClientRect();
    if (!rect || rect.width === 0 || rect.height === 0) {
      return { x: 50, y: 50 };
    }
    return {
      x: clamp(((clientX - rect.left) / rect.width) * 100, 0, 100),
      y: clamp(((clientY - rect.top) / rect.height) * 100, 0, 100),
    };
  };

  const handleImageClick = (e) => {
    e.stopPropagation();
    if (didPanRef.current || Date.now() - lastPanAtRef.current < 120) {
      didPanRef.current = false;
      return;
    }

    if (isZoomed) {
      setIsZoomed(false);
      setZoomOrigin({ x: 50, y: 50 });
    } else {
      setZoomOrigin(getRelativePoint(e.clientX, e.clientY));
      setIsZoomed(true);
    }
  };

  const handleToggleZoomButton = (e) => {
    e.stopPropagation();
    setIsZoomed((prev) => {
      if (prev) {
        setZoomOrigin({ x: 50, y: 50 });
      }
      return !prev;
    });
  };

  const handlePointerMove = (e) => {
    if (!isZoomed || e.pointerType !== "mouse") return;
    setZoomOrigin(getRelativePoint(e.clientX, e.clientY));
  };

  const handleTouchStart = (e) => {
    if (e.touches.length !== 1) return;
    const touch = e.touches[0];

    if (isZoomed) {
      setIsPanning(true);
      didPanRef.current = false;
      panStartRef.current = {
        x: touch.clientX,
        y: touch.clientY,
        originX: zoomOrigin.x,
        originY: zoomOrigin.y,
      };
      return;
    }

    swipeStartRef.current = {
      x: touch.clientX,
      y: touch.clientY,
    };
  };

  const handleTouchMove = (e) => {
    if (e.touches.length !== 1) return;
    const touch = e.touches[0];

    if (isZoomed && panStartRef.current && imageWrapperRef.current) {
      const rect = imageWrapperRef.current.getBoundingClientRect();
      if (rect.width === 0 || rect.height === 0) return;

      const deltaX = touch.clientX - panStartRef.current.x;
      const deltaY = touch.clientY - panStartRef.current.y;

      if (Math.abs(deltaX) > 4 || Math.abs(deltaY) > 4) {
        didPanRef.current = true;
        lastPanAtRef.current = Date.now();
      }

      setZoomOrigin({
        x: clamp(
          panStartRef.current.originX - (deltaX / rect.width) * 100,
          0,
          100,
        ),
        y: clamp(
          panStartRef.current.originY - (deltaY / rect.height) * 100,
          0,
          100,
        ),
      });
    }
  };

  const handleTouchEnd = (e) => {
    if (isZoomed) {
      setIsPanning(false);
      panStartRef.current = null;
      if (didPanRef.current) {
        lastPanAtRef.current = Date.now();
        didPanRef.current = false;
      }
      return;
    }

    if (!hasMultiple || !swipeStartRef.current || e.changedTouches.length === 0) {
      swipeStartRef.current = null;
      return;
    }

    const touch = e.changedTouches[0];
    const deltaX = touch.clientX - swipeStartRef.current.x;
    const deltaY = touch.clientY - swipeStartRef.current.y;
    swipeStartRef.current = null;

    if (Math.abs(deltaX) > 45 && Math.abs(deltaX) > Math.abs(deltaY) * 1.2) {
      if (deltaX < 0) {
        goToNext();
      } else {
        goToPrev();
      }
    }
  };

  if (typeof document === "undefined") return null;

  const isLoading = Boolean(fullUrl) && loadedUrl !== fullUrl;

  return createPortal(
    <AnimatePresence>
      {isOpen && currentImage && (
        <Motion.div
          ref={dialogRef}
          role="dialog"
          aria-modal="true"
          aria-label={`${productName} expanded image view`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0, pointerEvents: "none", transition: { duration: 0.15 } }}
          transition={{ duration: 0.2 }}
          onClick={onClose}
          className="fixed inset-0 z-[1000] bg-black/92 backdrop-blur-md flex flex-col select-none"
        >
          {/* Top bar */}
          <div
            onClick={(e) => e.stopPropagation()}
            className="shrink-0 z-20 flex items-center justify-between gap-4 px-4 sm:px-6 py-3 sm:py-4 text-white"
          >
            <div className="flex items-center gap-3 min-w-0">
              <span className="shrink-0 rounded-full bg-white/12 px-3 py-1 text-xs sm:text-sm font-medium tracking-wide text-white/95">
                {safeIndex + 1} / {imageCount}
              </span>
              <p className="truncate text-sm sm:text-base font-medium text-white/90">
                {productName}
              </p>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <button
                type="button"
                onClick={handleToggleZoomButton}
                className="w-10 h-10 rounded-full bg-white/12 hover:bg-white/22 text-white flex items-center justify-center transition cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-white"
                aria-label={isZoomed ? "Zoom out" : "Zoom in"}
                title={isZoomed ? "Zoom out" : "Zoom in"}
              >
                {isZoomed ? (
                  <LuZoomOut className="w-5 h-5" />
                ) : (
                  <LuZoomIn className="w-5 h-5" />
                )}
              </button>

              <button
                ref={closeButtonRef}
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onClose();
                }}
                className="w-10 h-10 rounded-full bg-white/12 hover:bg-white/22 text-white flex items-center justify-center transition cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-white"
                aria-label="Close expanded image view"
                title="Close (Esc)"
              >
                <LuX className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Main image stage */}
          <div
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
            className="relative flex-1 min-h-0 w-full flex items-center justify-center px-3 sm:px-16 py-2 overflow-hidden"
          >
            {hasMultiple && (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  goToPrev();
                }}
                className="absolute left-2 sm:left-5 top-1/2 -translate-y-1/2 z-20 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-black/50 hover:bg-black/75 border border-white/15 text-white flex items-center justify-center backdrop-blur-sm transition cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-white"
                aria-label="Previous image"
                title="Previous (Left Arrow)"
              >
                <LuChevronLeft className="w-6 h-6" />
              </button>
            )}

            <div
              ref={imageWrapperRef}
              onPointerMove={handlePointerMove}
              className="relative inline-flex items-center justify-center max-w-full max-h-full"
            >
              {isLoading && (
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-0">
                  <div className="h-9 w-9 animate-spin rounded-full border-2 border-white/25 border-t-white" />
                </div>
              )}

              <Motion.img
                key={currentImage.url + "-" + safeIndex}
                ref={imgRef}
                src={fullUrl}
                alt={`${productName} - image ${safeIndex + 1} of ${imageCount}`}
                draggable={false}
                onClick={handleImageClick}
                onLoad={() => setLoadedUrl(fullUrl)}
                onError={() => setLoadedUrl(fullUrl)}
                initial={{ opacity: 0.6, scale: 0.98 }}
                animate={{ opacity: 1, scale: isZoomed ? 2 : 1 }}
                transition={
                  isPanning
                    ? { duration: 0 }
                    : { duration: 0.2, ease: "easeOut" }
                }
                style={{
                  transformOrigin: `${zoomOrigin.x}% ${zoomOrigin.y}%`,
                }}
                className={`relative z-10 w-auto h-auto max-w-full ${
                  hasMultiple
                    ? "max-h-[calc(100dvh-11.5rem)] sm:max-h-[calc(100dvh-12.5rem)]"
                    : "max-h-[calc(100dvh-6.5rem)] sm:max-h-[calc(100dvh-7.5rem)]"
                } object-contain rounded-lg shadow-2xl ${
                  isZoomed ? "cursor-zoom-out" : "cursor-zoom-in"
                }`}
              />
            </div>

            {hasMultiple && (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  goToNext();
                }}
                className="absolute right-2 sm:right-5 top-1/2 -translate-y-1/2 z-20 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-black/50 hover:bg-black/75 border border-white/15 text-white flex items-center justify-center backdrop-blur-sm transition cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-white"
                aria-label="Next image"
                title="Next (Right Arrow)"
              >
                <LuChevronRight className="w-6 h-6" />
              </button>
            )}
          </div>

          {/* Thumbnail strip */}
          {hasMultiple && (
            <div className="shrink-0 z-20 w-full px-4 py-3 sm:py-4 flex justify-center">
              <div
                onClick={(e) => e.stopPropagation()}
                className="flex items-center gap-2.5 overflow-x-auto max-w-full px-2 py-1"
              >
                {images.map((item, idx) => {
                  const isActive = idx === safeIndex;
                  return (
                    <button
                      key={`${item.url}-${idx}`}
                      ref={(el) => {
                        thumbnailRefs.current[idx] = el;
                      }}
                      type="button"
                      onClick={() => selectImage(idx)}
                      aria-label={`View image ${idx + 1} of ${imageCount}`}
                      aria-current={isActive ? "true" : undefined}
                      className={`shrink-0 rounded-lg overflow-hidden border-2 transition-all duration-200 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-white ${
                        isActive
                          ? "border-white ring-2 ring-white/50 opacity-100 scale-105"
                          : "border-transparent opacity-55 hover:opacity-90"
                      }`}
                    >
                      <img
                        src={getOptimizedUrl(item.url, 200)}
                        alt={`${productName} thumbnail ${idx + 1}`}
                        className="w-13 h-13 sm:w-16 sm:h-16 object-cover block"
                        loading="lazy"
                      />
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </Motion.div>
      )}
    </AnimatePresence>,
    document.body,
  );
};

export default ProductImageLightbox;
