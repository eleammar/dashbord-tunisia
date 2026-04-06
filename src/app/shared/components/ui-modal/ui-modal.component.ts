import {
  Component, Input, Output, EventEmitter,
  HostListener, OnInit, OnDestroy
} from '@angular/core';
import { CommonModule } from '@angular/common';

type ModalSize = 'sm' | 'md' | 'lg' | 'xl' | 'full';

@Component({
  selector: 'app-modal',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './ui-modal.component.html',
})
export class ModalComponent implements OnInit, OnDestroy {
  @Input() title?:       string;
  @Input() isOpen       = false;
  @Input() size: ModalSize = 'md';
  @Input() closable     = true;
  @Input() showFooter   = true;
  @Input() confirmLabel = 'Confirmer';
  @Input() cancelLabel  = 'Annuler';
  @Input() loading      = false;
  @Input() danger       = false;

  @Output() closed    = new EventEmitter<void>();
  @Output() confirmed = new EventEmitter<void>();

  readonly sizeMap: Record<ModalSize, string> = {
    sm:   'max-w-sm',
    md:   'max-w-lg',
    lg:   'max-w-2xl',
    xl:   'max-w-4xl',
    full: 'max-w-[95vw] max-h-[95vh]',
  };

  ngOnInit(): void    { document.body.style.overflow = 'hidden'; }
  ngOnDestroy(): void { document.body.style.overflow = '';        }

  close(): void {
    if (this.closable && !this.loading) this.closed.emit();
  }

  confirm(): void { this.confirmed.emit(); }

  @HostListener('document:keydown.escape')
  onEscape(): void { this.close(); }
}