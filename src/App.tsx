import { useState } from "react";

// フィルター状態を表すセレクトボックス
type Filter = 'all' | 'checked' | 'unchecked' | 'removed';

// "Todo型" の定義
type Todo = {
  // プロパティ value は文字列型
  value: string;
  readonly id: number;　//読み取り専用（readonly）
  checked: boolean;　// 完了/未完了を示すプロパティ
  removed: boolean;　// タスクの削除/未削除を示すフラグ
};

export const App = () => {

  // ステート
  const [text, setText] = useState('');
  const [todos, setTodos] = useState<Todo[]>([]);
  const [filter, setFilter] = useState<Filter>('all');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setText(e.target.value);
  };

  // todos ステートを更新する関数
  const handleSubmit = () => {
    // 何も入力されていなかったらリターン
    if (!text) return;

    const handleEdit = (id: number, value: string) => {
      setTodos((todos) => {
        /**
         * 引数として渡された todo の id が一致する
         * 更新前の todos ステート内の todo の
         * value プロパティを引数 value (= e.target.value) に書き換える
         */
        const newTodos = todos.map((todo) => {
          if (todo.id === id) {
            return { ...todo, value };　//コピー元（todos）は変更されず、コピー先（newTodos）にvalueを追加する
          }
          return todo;
        });
        // todos ステートを更新
        return newTodos;
      });
    };

    // チェックボックスイベント
    const handleCheck = (id: number, checked: boolean) => {
      setTodos((todos) => {
        const newTodos = todos.map((todo) => {
          if (todo.id === id) {
            return { ...todo, checked };
          }
          return todo;
        });
  
        return newTodos;
      });
    };

    // 削除ボタンイベント
    const handleRemove = (id: number, removed: boolean) => {
      setTodos((todos) => {
        const newTodos = todos.map((todo) => {
          if (todo.id === id) {
            return { ...todo, removed };
          }
          return todo;
        });
  
        return newTodos;
      });
    };

    // セレクトフィルターイベント
    const handleFilter = (filter: Filter) => {
      setFilter(filter);
    };

    // ゴミ箱を空にするイベント
    const handleEmpty = () => {
      // シャローコピーで事足りる
      setTodos((todos) => todos.filter((todo) => !todo.removed));
    };

    //  <ul> ~ </ul> タグの中で展開されている todos ステート をタグへ渡す前に加工する
    const filteredTodos = todos.filter((todo) => {
      // filter ステートの値に応じて異なる内容の配列を返す
      switch (filter) {
        case 'all':
          // 削除されていないもの
          return !todo.removed;
        case 'checked':
          // 完了済 **かつ** 削除されていないもの
          return todo.checked && !todo.removed;
        case 'unchecked':
          // 未完了 **かつ** 削除されていないもの
          return !todo.checked && !todo.removed;
        case 'removed':
          // 削除済みのもの
          return todo.removed;
        default:
          return todo;
      }
    });

    const newTodo: Todo = {
      // text ステートの値を value プロパティへ
      value: text,
      id: new Date().getTime(), //Tdo型オブジェクトの型定義が更新されたためnumber型のidオブジェクトが必要
      checked: false,　// 初期値（todo 作成時）は false
      removed: false, // 初期値（未削除）
    };

    /**
     * 更新前の todos ステートを元に
     * スプレッド構文で展開した要素へ
     * newTodo を加えた新しい配列(todos)でステートを更新
     **/
    setTodos((todos) => [newTodo, ...todos]);
    // フォームへの入力をクリアする
    setText('');

    //コンポーネント内で発火するイベントを処理する関数＝コールバック関数

  return (
      <div>
        <select defaultValue="all" onChange={(e) => handleFilter(e.target.value as Filter)}>  {/* filter型でセレクトの値を受け取る */}
        <option value="all">すべてのタスク</option>
        <option value="checked">完了したタスク</option>
        <option value="unchecked">現在のタスク</option>
        <option value="removed">ごみ箱</option>
      </select>
      {/* フィルターが `removed` のときは「ごみ箱を空にする」ボタンを表示 */}
      {filter === 'removed' ? (
      <button onClick={handleEmpty}
      disabled={todos.filter((todo) => todo.removed).length === 0}
      >
        ごみ箱を空にする
      </button>
    ) : (
      // フィルターが `checked` でなければ Todo 入力フォームを表示
      filter !== 'checked' && (
        <form onSubmit={(e) => {e.preventDefault();handleSubmit();}}>
        <input 
        type="text" 
        value={text}
        onChange={(e) => handleChange(e)} />
          <input 
          type="submit" 
          value="追加" 
          onSubmit={handleSubmit}/>
        </form>
        )
      )}
        <p>{text}</p>
        {/* リストをレンダーするときはkeyが必要（更新された際の検知で必須） */}
        <ul>
          {filteredTodos.map((todo) => {
            return(
               <li key={todo.id}>
                <input
                type="checkbox"
                disabled={todo.removed}
                checked={todo.checked}
                onChange={() => handleCheck(todo.id, !todo.checked)} // 呼び出し側で checked フラグを反転(!todo.checked)させる
                />
            <input
            type="text"
            disabled={todo.checked || todo.removed} //チェックボックスにチェックが入っていたら非活性、削除済みの場合は非活性
            value={todo.value}
            onChange={(e) => handleEdit(todo.id, e.target.value)}
          />
          <button onClick={() => handleRemove(todo.id, !todo.removed)}>
          {todo.removed ? '復元' : '削除'}
          </button>
          </li>);
          })}
        </ul>
      </div>
  )
}
}
export default App