import './App.css';
import InputBox from './components/InputBox';
import { io } from 'socket.io-client';
import { useCallback, useEffect, useRef, useState } from 'react';
import { getRandomColor } from './utils';
import WaitingList from './components/WaitingList';
import ReactCanvasConfetti from 'react-canvas-confetti';

import emptyFavicon from './assets/favicon.empty.svg';
import waitingFavicon from './assets/favicon.waiting.svg';

const favicon = document.querySelector('#favicon');

function App() {
	const [list, setList] = useState([]);
	const socket = useRef();
	// Timestamp: Indikation på hur längesen någon bad om hjälp
	// ✅ Math.random för random färg
	// Kevins MP3-ljud
	// ✅ Namn, Breakout room (optional)
	// Ändra favicon/title om listan är tom eller inte
	// Wishlist: Notifikation

	useEffect(() => {
		favicon.setAttribute(
			'href',
			list.length > 0 ? waitingFavicon : emptyFavicon
		);
	}, [list]);

	const animationInstanceRef = useRef(null);

	const getInstance = useCallback(instance => {
		animationInstanceRef.current = instance;
	}, []);

	const makeShot = useCallback((ratio, opts) => {
		animationInstanceRef.current &&
			animationInstanceRef.current({
				...opts,
				origin: { y: 0.7 },
				particleCount: Math.floor(200 * ratio),
			});
	}, []);

	const fire = useCallback(() => {
		makeShot(0.25, {
			spread: 26,
			startVelocity: 55,
		});

		makeShot(0.2, {
			spread: 60,
		});

		makeShot(0.35, {
			spread: 100,
			decay: 0.91,
			scalar: 0.8,
		});

		makeShot(0.1, {
			spread: 120,
			startVelocity: 25,
			decay: 0.92,
			scalar: 1.2,
		});

		makeShot(0.1, {
			spread: 120,
			startVelocity: 45,
		});
	}, [makeShot]);

	useEffect(() => {
		socket.current = io('https://waitinglist.osuka.dev');

		socket.current.on('connect', () => {
			console.log('Connected');
		});

		socket.current.on('new', data => {
			console.log(data);
			setList(data);
		});

		socket.current.on('error', err => {
			console.log(err);
		});

		socket.current.on('confetti', () => {
			fire();
		});
		return () => socket.current.off();
	}, [fire, socket]);

	function raiseHand(name, room) {
		socket.current.emit('help', {
			name: name,
			room: room,
			color: getRandomColor(),
		});
	}

	function lowerHand(id) {
		console.log('Removed: ' + id);
		socket.current.emit('done', {
			id: id,
		});
	}

	return (
		<div>
			<ReactCanvasConfetti
				refConfetti={getInstance}
				style={{
					position: 'fixed',
					pointerEvents: 'none',
					width: '100%',
					height: '100%',
					top: 0,
					left: 0,
				}}
			/>
			<InputBox onRaiseHand={raiseHand} />
			<WaitingList onLowerHand={lowerHand} list={list} />
		</div>
	);
}

export default App;
