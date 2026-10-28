import {useState} from 'react'
import { useEffect } from 'react';
import './App.css'

export default function App() {
  const [openWindows, setOpenWindows] = useState([]);

  const findings = [
    "Paper 1", "Paper 2",
    "Paper 3", "Paper 4",
    "MRA 05 - \“She had no Choice\”", "Paper 6", "ASC 07 - \"Of the Survivor\"",
    "Paper 8", "Paper 9",
    "BA1 - \“Demir’s Vignette 01\”", "Paper 11",
    "Paper 12"
  ];



  const contentMap = {
  "Paper 1": <p>
   
  </p>,

  "Paper 2": <img src="/images/journal2.png" alt="Journal" />,


  "Paper 3": <p>Entry from the archives...</p>,


  "Paper 4": (
    <div>
      <h3>Letter Fragment</h3>
      <p>“Hello!”</p>
    </div>
  ),
   "MRA 05 - \“She had no Choice\”": <p>I heard something the other day. A rumor, one that could destroy us.
    And sometimes I hope it will, but it won’t. He’s too powerful, his lies are too great.
    Our enemies too truthful. That rumor is what pushes people away from them.
    What is meant to hurt us will only make us stronger. It’s no wonder they chose us.
    I would have to, if I was in that position. But choices are no longer an option, we must obey.
</p>,
  "Paper 6": <img src="/images/diagram1.png" alt="Diagram" />,
  "ASC 07 - Of the Survivor": <p>
    She’s gone…I had hoped that there was some misunderstanding but no,
    she is really gone. And out of all people to do it…it was him.
    Does he even understand what he’s done? Does he understand
    how he hurt us all? How he hurt her??? I hate him, despise him.
    I can’t forgive him, I won’t.
  </p>,
  "Paper 8": <img src="/images/chart1.png" alt="Chart" />,
  "Paper 9": <p>Summary of findings...</p>,
  "BA1 - \“Demir’s Vignette 01\”": <p>
    There is a sadness in the air, or maybe it’s just me?
    Every time I take a breath, I feel it line my lungs, flow into my blood.
    It’s strange, for me to get teary eyed for a second and calm within a minute.
    It feels like I lost, but I knew that for some time, didn’t I?
    But then I find myself feeling pain for others,
    ...when they lack emotion it’s only because I stole it.
  </p>,
  // etc.
};



  return (
    <>
      <header className="main-header">
        <div className="TitleStrip">Findings</div>
        <div className="ArchiveList">
          {findings.map((title) => (
            <div
              key={title}
              className="ArchiveItem"
              onClick={() => {
                // clamp initial position so modal doesn't appear off-screen
                const openX = Math.max(20, Math.min(600, window.innerWidth - 420));
                const openY = Math.max(20, Math.min(400, window.innerHeight - 320));
                setOpenWindows(prev => [
                  ...prev,
                  {
                    id: Date.now(),
                    title,
                    x: openX,
                    y: openY,
                    width: 400,
                    height: 300,
                    content: contentMap[title] || <p>No content available.</p>,
                  },
                ]);
              }}
            >
              {title}
            </div>
          ))}
        </div>
      </header>

      {/*<div className="Checking">
        <h1>Anyone Here?</h1>
      </div>*/}

      {/* Render all floating windows */}
       {openWindows.map(window => (
        <FloatingWindow
          key={window.id}
          {...window}
          onClose={() =>
            setOpenWindows(prev => prev.filter(w => w.id !== window.id))
          }
        />
      ))}
    </>
  );
}

// ✅ FloatingWindow component with draggable header
function FloatingWindow({ id, title, x, y, width, height, content, onClose }) {
  const [position, setPosition] = useState({ x, y });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

  const [size, setSize] = useState({ width, height });
  const [isResizing, setIsResizing] = useState(false);
  const [resizeStart, setResizeStart] = useState({ x: 0, y: 0 });
  const [initialSize, setInitialSize] = useState({ width, height });

  useEffect(() => {
    const handleMouseMove = (e) => {
       if (isResizing) {
            const dx = e.clientX - resizeStart.x;
            const dy = e.clientY - resizeStart.y;
            setSize({
              width: Math.max(200, Math.min(window.innerWidth - position.x - 20, initialSize.width + dx)),
              height: Math.max(150, Math.min(window.innerHeight - position.y - 20, initialSize.height + dy)),
            });
          }
      //console.log("Resizing to:", e.clientX - position.x, e.clientY - position.y);
      if (isDragging) {
        setPosition({
          x: e.clientX - dragStart.x,
          y: e.clientY - dragStart.y,
        });
      }
    };

    const handleMouseUp = () => {
      setIsDragging(false);
      setIsResizing(false);
  };
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, dragStart, isResizing, resizeStart, position]);

  useEffect(() => {
    // Keep position/size in sync if props change
    setPosition({ x, y });
    setSize({ width, height });
    setInitialSize({ width, height });
  }, [x, y, width, height]);

  return (
    <div
      className="ModalOverlay"
      style={{
        position: 'absolute',
        left: `${position.x}px`,
        top: `${position.y}px`,
        width: `${size.width}px`,
        height: `${size.height}px`,
        zIndex: 1000,
        pointerEvents: 'auto',
      }}
    >
      <div className="ModalContent">
        <div
          className="ModalHeader"
          onMouseDown={(e) => {
            setIsDragging(true);
            setDragStart({
              x: e.clientX - position.x,
              y: e.clientY - position.y,
            });
          }}
          style={{
            cursor: 'grab',
            position: 'absolute',
            top: '0',
            left: '0',
            right: '0',
            height: '40px',
            padding: '0.5rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: '#333',
            color: 'white',
            borderTopLeftRadius: '8px',
            borderTopRightRadius: '8px',
            zIndex: 2,
          }}
        >
          {title}
          {/* close button placed inside the header so it sits on the black bar */}
          <button
            className="close-button"
            onMouseDown={(e) => e.stopPropagation()} /* prevent starting drag when clicking close */
            onClick={onClose}
            aria-label={`Close ${title}`}
          >
           [×]
          </button>
        </div>

        <div className="ModalBody" style={{ marginTop: '40px', padding: '1rem', height: 'calc(100% - 40px)', boxSizing: 'border-box'}}>
          {content || <p>No content available.</p>}
        </div>
        {/* Resize handle: placed as a direct child of ModalContent so it's anchored to the modal's bottom-right */}
        <div
          className="ResizeEdge"
          onMouseDown={(e) => {
            setIsResizing(true);
            setResizeStart({ x: e.clientX, y: e.clientY });
            setInitialSize({ width: size.width, height: size.height });
            e.stopPropagation();
          }}
        />
      </div>
    </div>
  );
}
