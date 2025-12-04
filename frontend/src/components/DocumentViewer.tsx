'use client'

import React, { forwardRef, useImperativeHandle, useRef, useState } from 'react'
import { TransformWrapper, TransformComponent } from 'react-zoom-pan-pinch'

export type DocumentViewerHandle = {
  reset: () => void
  getZoom: () => number
  setZoom: (z: number) => void
  zoomIn: () => void
  zoomOut: () => void
}

type DocumentViewerProps = {
  src: string
  alt?: string
  className?: string
  style?: React.CSSProperties
  onZoomChange?: (z: number) => void
  showControls?: boolean
}

const DocumentViewer = forwardRef<DocumentViewerHandle, DocumentViewerProps>(function DocumentViewer({ src, alt, className, style, onZoomChange, showControls = false }, ref) {
  const wrapperRef = useRef<any>(null)
  const [scale, setScale] = useState(1)

  useImperativeHandle(ref, () => ({
    reset: () => wrapperRef.current?.resetTransform(),
    getZoom: () => scale,
    setZoom: (z: number) => wrapperRef.current?.zoomTo?.(z, 200),
    zoomIn: () => wrapperRef.current?.zoomIn?.(1.2, 200),
    zoomOut: () => wrapperRef.current?.zoomOut?.(1.2, 200)
  }), [scale])

  return (
    <div className={`relative h-96 border rounded-lg shadow-sm bg-background ${className || ''}`} style={style}>
      <TransformWrapper
        ref={wrapperRef}
        wheel={{ disabled: false }}
        panning={{ disabled: false }}
        doubleClick={{ disabled: true }}
        onTransformed={(ctx) => {
          const s = ctx.state.scale
          setScale(s)
          onZoomChange?.(s)
        }}
      >
        {({ zoomIn, zoomOut, resetTransform }) => (
          <>
            <TransformComponent wrapperClass="w-full h-full" contentClass="w-full h-full">
              <div className="w-full h-full flex items-center justify-center overflow-hidden">
                <img src={src} alt={alt || ''} className="max-w-none select-none shadow-lg" draggable={false} />
              </div>
            </TransformComponent>

            {showControls && (
              <div className="absolute bottom-4 right-4 bg-black/50 backdrop-blur-sm text-white rounded-md shadow-md p-2 flex gap-2">
                <button className="inline-flex items-center justify-center rounded-md px-3 py-1 text-sm bg-white/10 hover:bg-white/20 shadow" onClick={() => zoomIn()}>Zoom In</button>
                <button className="inline-flex items-center justify-center rounded-md px-3 py-1 text-sm bg-white/10 hover:bg-white/20 shadow" onClick={() => zoomOut()}>Zoom Out</button>
                <button className="inline-flex items-center justify-center rounded-md px-3 py-1 text-sm bg-white/10 hover:bg-white/20 shadow" onClick={() => resetTransform()}>Reset</button>
              </div>
            )}
          </>
        )}
      </TransformWrapper>
    </div>
  )
})

export default DocumentViewer
