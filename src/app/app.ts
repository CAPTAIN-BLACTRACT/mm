import { Component, signal, computed, effect } from '@angular/core';
import {CommonModule} from '@angular/common';

export interface Card{
  id: number;
  icon: string;
  flipped: boolean;
  matched: boolean;
}
@Component({
  selector: 'app-root',
  imports: [CommonModule],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {

  icons = ['🍕', '🚀', '🐱', '🌵', '💎', '🔥', '🎉', '👾'];

  cards = signal<Card[]>([]);

  flippedCard = signal<Card[]>([]);

  moves= signal(0);

  constructor(){
    this.restartGame();
  }

  restartGame(){
    const deck = [...this.icons, ...this.icons];

    for(let i = deck.length-1; i>0; i--){
      const j = Math.floor(Math.random()*(i+1));
      [deck[i],deck[j]]= [deck[j],deck[i]];
    }

    this.cards.set(deck.map((icon, index)=>({
      id: index,
      icon,
      flipped: false,
      matched: false
    })));

    this.flippedCard.set([]);
    this.moves.set(0);
  }

  handleCardClick(card:Card){
    if( card.flipped || card.matched || this.flippedCard().length===2){
      return;
    }
    this.updateCardState(card.id, {flipped:true});

    const currentFlipped = [...this.flippedCard(), card];
    this.flippedCard.set(currentFlipped);

    if(currentFlipped.length===2){
      this.moves.update(m=>m+1);
      this.checkMatch(currentFlipped[0],currentFlipped[1]);

    }
  }

  checkMatch(card1: Card, card2: Card){
    if(card1.icon === card2.icon){
      this.updateCardState(card1.id,{matched: true});
      this.updateCardState(card2.id, {matched: true});
      this.flippedCard.set([]);
    }else{
      setTimeout(()=>{

        this.updateCardState(card1.id, {flipped: false});
        this.updateCardState(card2.id, {flipped: false});
        this.flippedCard.set([]);
      },1000);
    }
  }

  updateCardState(id: number, changes: Partial<Card>){
    this.cards.update(prev=>
                     prev.map(c=>c.id===id ?{...c,...changes}:c));
  }
}
