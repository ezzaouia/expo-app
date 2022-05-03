import { render } from "react-dom";
import React, { useRef, useState, useLayoutEffect, Suspense } from "react";
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { useLoader, useFrame, useThree, Canvas } from "@react-three/fiber";
import { Text, Html } from "@react-three/drei";
import {
  ZapparCamera,
  ImageTracker,
  ZapparCanvas,
  BrowserCompatibility,
} from "@zappar/zappar-react-three-fiber";
import {
  createUseGesture,
  useGesture,
  dragAction,
  pinchAction,
  useDrag,
  usePinch,
} from "@use-gesture/react";
import { a as a3f, useSpring, animated } from "@react-spring/three";

import targetFile from "../../assets/BusinessCard.zpt";

import Zapbolt from "../../assets/ZapparLog.glb";
import zapLaserMp3 from "../../assets/zapsplat_laser.mp3";

import cardBgTextureImg from "../../assets/BusinessCardPlain.png";
import webIconTextureImg from "../../assets/WebLaunch.png";
import facebookIconTextureImg from "../../assets/Facebook.png";
import phoneIconTextureImg from "../../assets/Phone.png";

import { Button, Popover, Image, Typography } from "antd";
import { InfoCircleOutlined } from "@ant-design/icons";

import './App.css';

// Background
function Background() {
  const mesh = useRef();
  const cardBgTexture = useLoader(
    THREE.TextureLoader,
    cardBgTextureImg
  );

  return (
    <mesh ref={mesh} position={[0, 0, 0]}>
      <planeBufferGeometry args={[3, 2]} />
      <meshStandardMaterial attach="material" map={cardBgTexture} />
    </mesh>
  );
}
// Icons
function Icons({ anchor }) {
  const webIconTexture = useLoader(
    THREE.TextureLoader,
    webIconTextureImg
  );
  const facebookIconTexture = useLoader(
    THREE.TextureLoader,
    facebookIconTextureImg
  );
  const phoneIconTexture = useLoader(
    THREE.TextureLoader,
    phoneIconTextureImg
  );

  const contentStyle = {
    height: "100px",
    width: "100px",
    color: "#fff",
    lineHeight: "160px",
    textAlign: "center",
    background: "#364d79",
  };

  return (
    <group>
      {anchor ? (
        <mesh
          position={[-2.2, 0.65, 0.3]}
          // onClick={() =>}
        >
          <Html>
            <Popover
              title={"More Info.."}
              content={
                <>
                  <Typography.Title>Title</Typography.Title>
                  <Image
                    width={100}
                    src="https://gw.alipayobjects.com/zos/antfincdn/aPkFc8Sj7n/method-draw-image.svg"
                  />
                </>
              }
              trigger="click"
            >
              <Button icon={<InfoCircleOutlined />}>Click</Button>
            </Popover>
          </Html>
        </mesh>
      ) : null}

      <mesh
        position={[-1.2, 0.65, 0.3]}
        // onClick={() =>}
      >
        <planeBufferGeometry args={[0.38, 0.38]} />
        <meshBasicMaterial
          attach="material"
          map={webIconTexture}
          color="white"
          transparent
        />
      </mesh>
      <mesh
        position={[-0.75, 0.65, 0.3]}
        onClick={() => window.open("https://zap.works")}
      >
        <planeBufferGeometry args={[0.38, 0.38]} />
        <meshBasicMaterial
          attach="material"
          map={facebookIconTexture}
          color="white"
          transparent
        />
      </mesh>
      <mesh
        position={[-0.3, 0.65, 0.3]}
        onClick={() => window.open("tel:123-456-7890123")}
      >
        <planeBufferGeometry args={[0.38, 0.38]} />
        <meshBasicMaterial
          attach="material"
          map={phoneIconTexture}
          color="white"
          transparent
        />
      </mesh>
    </group>
  );
}
// Name and Title
function Nametitle() {
  return (
    <group>
      <mesh>
        <Text color="white" position={[-0.958, 0.1, 0.1]} fontSize={0.13}>
          Francesca Ellis
        </Text>
        <Text color="white" position={[-0.85, -0.033, 0.1]} fontSize={0.1}>
          Junior Support Engineer
        </Text>
      </mesh>
    </group>
  );
}
// Call To Action
function Cta() {
  return (
    <mesh>
      <Text
        color="white"
        position={[-0.86, -0.65, 0.1]}
        fontSize={0.1}
        maxWidth={0.8}
        textAlign="center"
      >
        Tap on an icon to find out more!
      </Text>
    </mesh>
  );
}
// Sound
function Sound() {
  const listener = new THREE.AudioListener();
  const ZapLaser = new THREE.Audio(listener);

  const audioLoader = new THREE.AudioLoader();
  audioLoader.load(zapLaserMp3, (buffer) => {
    ZapLaser.setBuffer(buffer);
    ZapLaser.setLoop(false);
    ZapLaser.play();
  });
}
// 3D Model; Adjusted - https://codesandbox.io/s/r3f-ibl-envmap-simple-k7q9h?file=/src/App.js
function Model({ anchor }) {
  const [hovered, hover] = useState(false);
  const [clicked, click] = useState(false);
  const [active, setActive] = useState(false);

  const mesh = useRef();
  // Create a scene with our model
  useFrame((state, delta) => {
    const t = state.clock.getElapsedTime();

    mesh.current.rotation.x = THREE.MathUtils.lerp(
      mesh.current.rotation.x,
      Math.cos(t / 2) / 5,
      0.1
    );
    mesh.current.rotation.y = THREE.MathUtils.lerp(
      mesh.current.rotation.y,
      Math.sin(t / 4) / 5,
      0.1
    );
    mesh.current.rotation.z = THREE.MathUtils.lerp(
      mesh.current.rotation.z,
      Math.sin(t / 4) / 5,
      0.1
    );
  });

  const { scene } = useLoader(GLTFLoader, Zapbolt);

  const { size, viewport } = useThree();
  const { width, height, factor } = viewport;
  const aspect = size.width / viewport.width;
  const [{ rot, scale, position }, api] = useSpring(() => ({
    rot: [0, 0, 0],
    scale: [2, 2, 2],
    position: [0, 0, 0],
  }));

  const binding = useGesture(
    {
      onDrag: ({ scrolling, active, offset: [y, z], down }) => {
        console.log("dragging");
        // console.log("scrolling", scrolling);
        setActive(active);

        if (true) {
          api.start({
            rot: [z / 50, y / 50, 0],
            scale: active ? [3, 3, 3] : [2, 2, 2],
          });
        } else {
          // api.start({
          //   position: [x, y, 0],
          //   scale: active ? [1, 1, 1] : [2, 0.8, 0.8],
          // });
        }
      },
      onPinch: ({
        origin: [ox, oy],
        first,
        movement: [ms],
        offset: [s, a],
        memo,
      }) => {
        console.log("pinching");
        return memo;
      },
    },
    {
      drag: {
        preventScroll: true,
        // bounds: {
        //         left: -width / 2,
        //         right: width / 2,
        //         top: -height / 2,
        //         bottom: height / 2,
        //       },
        // rubberband: true,
      },
      // transform: ([x, y]) => [x / aspect, -y / aspect],
    }
  );

  // Return our model as a primitive
  return (
    <a3f.group
      ref={mesh}
      // scale={clicked ? 1.5 : 1}
      // onClick={(event) => click(!clicked)}
      // onPointerOver={(event) => hover(true)}
      // onPointerOut={(event) => hover(false)}
      position={position}
      rotation={rot}
      scale={scale}
      {...binding()}
    >
      <mesh
        ref={mesh}
        // scale={clicked ? 1.5 : 1}
        // onClick={(event) => click(!clicked)}
        // onPointerOver={(event) => hover(true)}
        // onPointerOut={(event) => hover(false)}
      >
        <primitive
          object={scene}
          dispose={null}
          position={[0.57, -0.05, 0]}
          scale={[2, 2, 2]}
          rotation={[0, 0, 0.01]}
          onClick={() => Sound()}
        />
        <meshStandardMaterial color={hovered ? "hotpink" : "orange"} />
      </mesh>
    </a3f.group>
  );
}

function App() {
  // Set up states
  // const set = useThree((state) => state.set);
  const [visibleState, setVisibleState] = useState(false);
  // const cameraRef: any = useRef();

  // useLayoutEffect(() => {
  //   set(() => ({ camera: cameraRef.current }));
  // }, []);
  //

  //  ref={cameraRef}

  return (
    <>
      <BrowserCompatibility />
      {/* Setup Zappar Canvas */}
      <Canvas gl={{ antialias: true }} colorManagement={false}>
        {/* Setup Zappar Camera */}
        <ZapparCamera makeDefault={false} renderPriority={0} />
        {/* Setup Zappar Image Tracker, passing our target file */}
        <Suspense fallback={null}>
          <ImageTracker
            onNotVisible={() => {
              setVisibleState(false);
            }}
            onNewAnchor={(anchor) => console.log(`New anchor ${anchor.id}`)}
            onVisible={() => {
              setVisibleState(true);
            }}
            targetImage={targetFile}
            visible={visibleState}
          >
            {/* Setup Content */}
            <Background />
            <Icons anchor={visibleState} />
            <Nametitle />
            <Cta />
            <Model />
          </ImageTracker>
        </Suspense>
        {/* Normal directional light */}
        <directionalLight position={[2.5, 8, 5]} intensity={1.5} castShadow />
      </Canvas>
    </>
  );
}

// render(<App />, document.getElementById("auraverse"));

export default App;
