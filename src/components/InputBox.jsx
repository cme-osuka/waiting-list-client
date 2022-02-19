import React, { useState } from 'react';
import styles from './InputBox.module.css';

const breakoutRooms = Array(12)
	.fill('')
	.map((_, i) => (
		<option value={`BR${i + 1}`} key={'option' + i}>
			BR{i + 1}
		</option>
	));

function InputBox(props) {
	const [name, setName] = useState('');
	const [room, setRoom] = useState('general');
	// Namn, breakout-room

	function handleNameChange(e) {
		setName(e.target.value);
	}

	function handleRoomChange(e) {
		setRoom(e.target.value);
	}

	function handleSubmit(e) {
		e.preventDefault();
		props.onRaiseHand(name, room);
	}

	return (
		<form onSubmit={handleSubmit} className={styles.form}>
			<input
				className={styles.input}
				onChange={handleNameChange}
				placeholder="Namn"
				type="text"
				value={name}
				required={true}
			/>
			<div className={styles.container}>
				<div className={styles.selectContainer}>
					<select
						className={styles.select}
						onChange={handleRoomChange}
						value={room}
					>
						<option value="general">General</option>
						{breakoutRooms}
					</select>
				</div>
				<button className={styles.button}>✋</button>
			</div>
		</form>
	);
}

export default InputBox;
