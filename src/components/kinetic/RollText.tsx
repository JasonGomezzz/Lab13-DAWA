/** Texto que rueda hacia arriba al pasar el cursor por el botón padre (.k-btn). */
export default function RollText({ children }: { children: string }) {
  return (
    <span className="k-roll">
      <span className="k-roll-in">
        <span>{children}</span>
        <span aria-hidden>{children}</span>
      </span>
    </span>
  );
}
