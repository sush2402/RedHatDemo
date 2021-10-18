import { useEffect, useMemo, useState } from 'react'
import { useTable, useSortBy, Row } from 'react-table'
import axios from 'axios'

function Table({ columns, data }: any) {
  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    prepareRow,
    rows
  } = useTable(
    { columns, data },
    useSortBy
  )
  return (
    <>
    <table
      {...getTableProps()}
      style={{ borderCollapse: "collapse", width: "100%" }}
    >
      <thead>
        {headerGroups.map((group: any) => (
          <tr {...group.getHeaderGroupProps()}>
            {group.headers.map((column: any) => (
              <th {...column.getHeaderProps(column.getSortByToggleProps())}>
                {column.render("Header")}
                <span>
                    {column.isSorted
                      ? column.isSortedDesc
                        ? ' 🔽'
                        : ' 🔼'
                      : ''}
                  </span>
              </th>
            ))}
          </tr>
        ))}
      </thead>
      <tbody {...getTableBodyProps()}>
        {rows.map((row: Row, i: number) => {
          prepareRow(row);
          return (
            <tr {...row.getRowProps()}>
              {row.cells.map((cell: any) => {
                return <td {...cell.getCellProps()}>{cell.render("Cell")}</td>;
              })}
            </tr>
          );
        })}
      </tbody>
    </table>
  </>
  );
}

function App() {
  const [repoData, setrepoData] = useState([])
  const [searchValue, setSearchValue] = useState('')
  const [filterData, setFilterData] = useState([])
  const columns = useMemo(
    () => [
      {
        Header: 'Git Repo',
        columns: [
          {
            Header: 'Owner',
            accessor: 'ownerName',
          },
          {
            Header: 'Name',
            accessor: 'name',
          },
          {
            Header: 'Description',
            accessor: 'description',
          },
          {
            Header: 'Stars',
            accessor: 'stargazers_count',
          },
          {
            Header: 'Open issues count',
            accessor: 'open_issues_count',
          },
          {
            Header: 'Watchers',
            accessor: 'watchers_count',
          }
        ],
      },
    ],
    []
  )
  

  const searchRepo = (e: any) => {
    setSearchValue(e.target.value)
    debounce(callAPI(e.target.value))
  }

  const callAPI = (username: string) => {
    try {
      axios.get(`https://api.github.com/users/${username}/repos`).then((resp: any)=> {
        let arr = resp.data && resp.data.map((item: any) => {
          return {...item, ownerName: <div><img src={item.owner.avatar_url} title={item.owner.login} alt=''/> {item.owner.login}</div> }
        })
      setrepoData(arr)
    }).catch(err => console.log(err))
  } catch(e) {
    console.log(e);
  }
  }

function debounce (fun: any) {
  let timer: any
  return function(this: any) {
    let context = this
    let args = arguments
    clearTimeout(timer)
    timer = setTimeout(() => {
      fun.apply(context, args)
    },300)
  }
}

const filters =  (e: any, filterValue: string) => {
  if(filterValue === 'name') {
    let arr = repoData.filter((item: any) => item.name.toLowerCase().includes(e.target.value))
    setFilterData(arr)
  }
  if(filterValue === 'description') {
    let arr = repoData.filter((item: any) => item.description.toLowerCase().includes(e.target.value))
    setFilterData(arr)
  }
}

  return (
    <div>
      <div id='searchBox'>
        <label data-testid='search'>Search: </label>
        <input type='text' data-testid='inputId' value={searchValue} onChange={(e)=> searchRepo(e)} />
      </div>
      <div id='filterBox'>
        <label>Filter with name: </label>
        <input type='text' onChange={(e)=> filters(e, 'name')} />
        <label>Filter with Description: </label>
        <input type='text' onChange={(e)=> filters(e, 'description')} />
      </div>
      <Table columns={columns} data={filterData.length > 0 ? filterData : repoData} />
    </div>
  )
}

export default App
