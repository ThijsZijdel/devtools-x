//
// export const ColorThemePalette = ({
//
//                                   }: {
//
// }) => {
//
//     // const converter = typeScriptConverter
//     const [exporting, setExporting] = useState(false);
//     const [exportType, setExportType] = useState('SVG');
//     const exporter = (
//         exportOptions.find((option) => option.name === exportType)
//     ) ?? exportOptions[2];
//     const converter = exporter?.converter ?? javascriptConverter;
//
//     const hsva = {
//         h: 0,
//         s: 0,
//         v: 0,
//         a: 0,
//     }
//     const {
//         addHue,
//         colors,
//         active,
//         updateShades, setActive,
//         getHue,
//     } = useColorStore(state => state);
//
//
//
//     const toIdString = (string: string) => {
//         return string.replace(/[^a-zA-Z0-9]/g, '')
//     }
//
//
//
//     const minShade = 100;
//     const maxShade = 900;
//     const numShades = colors?.[0]?.shades?.length ?? 0;
//     const stepSize = numShades > 10 ? (maxShade - minShade) / (numShades - 1) : 100;
//
//     const getShadeId = (shade: number) => {
//         shade = minShade + shade * stepSize;
//         shade = Math.round(shade / 50) * 50; // Round to the nearest multiple of 50
//         shade = Math.max(minShade, Math.min(maxShade, shade)); // Ensure shade is within the range
//         return shade;
//     }
//
//
//     const [converted, setConverted] = useState<string>('');
//     const fileType = exporter?.file ?? 'css';
//     const [separator, setSeparator] = useState<string>(',');
//     const [header, setHeader] = useState<boolean>(false);
//     const [space, setSpace] = useState<ColorSpace>('HEX' as ColorSpace);
//     const hues = colors.map(hue => ({
//         ...hue,
//         id: toIdString(hue.id ?? hue.name ?? ''),
//         shades: hue.shades?.map((shade, index) => ({
//             ...shade,
//             shade: getShadeId(index),
//         }))
//     })) as Hue[];
//
//
//     const toSpace: ToSpace = spaces.find(s => s.name === space)?.converter ?? spaces[0]?.converter;
//
//     useEffect(() => {
//         setConverted('');
//         const withHeader = header && separator != '\n' && separator != ' '
//         setTimeout(() => {
//             setConverted(converter(hues, toSpace, separator, withHeader));
//         }, 10);
//     }, [exporter.name, separator, header, space, toSpace])
//
//     const downloadPalette = () => {
//         const blob = new Blob([converted], {type: exporter.format});
//         const url = URL.createObjectURL(blob);
//         const link = document.createElement('a');
//         link.href = url;
//         link.download = `mosanicPalette${exporter.append ? exporter.append : ''}.${fileType}`;
//         document.body.appendChild(link);
//         link.click();
//         document.body.removeChild(link);
//
//     }
//
//     return !colors?.length ? null : (
//         <div className="w-full px-6 py-8">
//
//
//
//
//             {/* <h3 className="font-semibold text-xl mb-5">
//                 {displayName ?? 'Select a color'}
//             </h3> */}
//             {colors?.map((hue, index) => (
//                 <div className={`flex justify-evenly`} key={hue.id}>
//                     {hue.shades?.map((shade, index) => (
//                         <div key={index}
//                              onClick={() => setActive({
//                                  ...active,
//                                  hue: hue.id ?? '',
//                                  shade: index
//                              })}
//                              style={{
//                                  backgroundColor: shade.hex
//                              }}
//                              className={classNames(
//                                  (index === active?.shade && active?.hue === hue.id) ? `
//                                 font-bold  scale-110 border-transparent shadow-xl rounded z-10 ring-1
//                                 ${canBeWhite(shade.hex ?? '#fff') ? 'ring-white' : 'ring-black-900'}
//                             ` :
//                                      'hover:border-transparent hover:scale-105 hover:shadow-md'
//                                  ,
//                                  canBeWhite(shade.hex ?? '#fff') ? 'text-white' : '',
//                                  "flex w-full text-xs py-1 items-center justify-center cursor-pointer",
//                                  " ",
//                                  "transition-all duration-200 ease-in-out"
//                              )}
//                         >
//                             {index + 1}
//                         </div>
//                     ))}
//                 </div>
//             ))}
//
//             <button className="mt-4 w-full py-2 rounded bg-gray-100 text-black text-xs font-semibold"
//                     onClick={() => setExporting(true)}
//             >
//                 Export
//             </button>
//
//             <Modal open={exporting} onCancel={() => setExporting(false)} title=""  footer={null} width={875}>
//                 <div className="flex justify-between gap-x-2 lg:gap-x-4">
//                     <div className="flex flex-col gap-y-2">
//                         <h3 className="font-semibold text-lg">
//                             Palette Export
//                         </h3>
//                         <p className="text-sm">
//                             Export your Mosanic palette to a variety of formats.
//                         </p>
//                         <h5 className="font-semibold text-sm mt-4 mb-2">
//                             Export methods
//                         </h5>
//                         <div className="grid grid-cols-4 gap-3">
//                             {exportOptions.map((option, index) => (
//                                 <button key={index}
//                                         onClick={() => setExportType(option.name)}
//                                         className={classNames(
//                                             option.name === exportType ? 'bg-gray-100' : '',
//                                             "rounded px-3 py-1 text-xs font-semibold",
//                                             "border border-gray-200",
//                                             "transition-all duration-200 ease-in-out",
//                                             "hover:bg-gray-100",
//                                         )}
//                                 >
//                                     {option.name}
//                                 </button>
//                             ))}
//                         </div>
//
//                         {exporter?.name === 'Raw' && (
//                             <div>
//                                 <h5 className="font-semibold text-sm my-2">
//                                     Separator
//                                 </h5>
//                                 <div className="grid grid-cols-4 gap-3">
//                                     {rawSeparator.map((option, index) => (
//                                         <button key={index}
//                                                 onClick={() => setSeparator(
//                                                     option === 'Comma' ? ',' :
//                                                         option === 'Semicolon' ? ';' :
//                                                             option === 'Space' ? ' ' :
//                                                                 option === 'New line' ? '\n' :
//                                                                     '\t'
//                                                 )}
//                                                 className={classNames(
//                                                     (
//                                                         option === 'Comma' ? ',' :
//                                                             option === 'Semicolon' ? ';' :
//                                                                 option === 'Space' ? ' ' :
//                                                                     option === 'New line' ? '\n' :
//                                                                         '\t'
//                                                     ) === separator ? 'bg-gray-100' : '',
//                                                     "rounded px-3 py-1 text-xs font-semibold",
//                                                     "border border-gray-200",
//                                                     "transition-all duration-200 ease-in-out",
//                                                     "hover:bg-gray-100",
//                                                 )}
//                                         >
//                                             {option}
//                                         </button>
//                                     ))}
//                                 </div>
//                                 {/* setHeader */}
//                                 {separator != '\n' && separator != ' ' && (
//                                     <div className="flex items-center mt-4">
//                                         <input type="checkbox" id="header" name="header" checked={header} onChange={() => setHeader(!header)}
//                                                className="rounded border-2 w-4 h-4 ring-black focus:ring-2 focus:ring-black-900
//                                         transition-all duration-200 ease-in-out
//                                         black-900 hover:bg-gray-200 hover:ring-2 hover:ring-black-900 border-gray-200
//                                         checked:bg-black-900 checked:border-transparent checked:ring-transparent checked:ring-0
//                                         active:bg-black-600 focus:bg-black-400
//                                         "
//                                         />
//                                         <label htmlFor="header" className="ml-2 text-xs">
//                                             Include header
//                                         </label>
//                                     </div>
//                                 )}
//
//                             </div>
//                         )}
//                         {exporter?.name != 'SVG' && (
//                             <>
//                                 <h5 className="font-semibold text-sm mt-2">
//                                     Color format
//                                 </h5>
//                                 <Listbox value={space} onChange={setSpace}>
//                                     {({ open }) => (
//                                         <>
//                                             <Listbox.Button
//                                                 className={classNames(
//                                                     "flex items-center py-2 px-3 w-fit text-left bg-white rounded-lg cursor-default",
//                                                     "transition-all duration-200 ease-in-out",
//                                                     "text-xs font-semibold",
//                                                     "border border-gray-200",
//                                                     "hover:bg-gray-100",
//                                                 )}
//                                             >
//                                                 {space}
//                                                 {open ? (
//                                                     <ChevronUpIcon
//                                                         className="ml-2 h-5 w-5 text-black-900"
//                                                     />
//                                                 ) : (
//                                                     <ChevronDownIcon
//                                                         className="ml-2 h-5 w-5 text-black-900"
//                                                     />
//                                                 )}
//                                             </Listbox.Button>
//                                             <Transition
//                                                 show={open}
//                                                 enter="transition duration-100 ease-out"
//                                                 enterFrom="transform scale-95 opacity-0"
//                                                 enterTo="transform scale-100 opacity-100"
//                                                 leave="transition duration-75 ease-out"
//                                                 leaveFrom="transform scale-100 opacity-100"
//                                                 leaveTo="transform scale-95 opacity-0"
//                                             >
//                                                 <Listbox.Options className="absolute bottom-14 z-10 w-23 rounded-lg bg-white py-1.5 text-xs shadow ring-1 ring-black ring-opacity-5 focus:outline-none sm:ml-auto sm:text-xs">
//                                                     {spaces.map((_space) => (
//                                                         /* Use the `active` state to conditionally style the active option. */
//                                                         /* Use the `selected` state to conditionally style the selected option. */
//                                                         <Listbox.Option key={_space.name} value={_space.name} as={Fragment}>
//                                                             {({ active, selected }) => (
//                                                                 <li
//                                                                     className={classNames(
//                                                                         active ? 'bg-gray-100' : 'bg-white',
//                                                                         'flex px-3 py-1.5 cursor-pointer'
//                                                                     )}
//                                                                 >
//                                                                     {selected ? <CheckIcon className="w-4 h-4 mr-2" /> : <div className="w-4 h-4 mr-2" />}
//                                                                     {_space.name}
//                                                                 </li>
//                                                             )}
//                                                         </Listbox.Option>
//                                                     ))}
//                                                 </Listbox.Options>
//                                             </Transition>
//                                         </>
//                                     )}
//                                 </Listbox>
//                                 <button onClick={downloadPalette} className="px-4 py-2 border border-gray-200 rounded-md text-gray-500 hover:bg-gray-100 text-center text-xs font-semibold duration-300 ease-out hover:text-gray-900 mt-auto">
//                                     Download
//                                 </button>
//                             </>
//                         )}
//                     </div>
//                     <div className="flex flex-col gap-y-2 w-[400px] h-[350px]">
//                         {exporter?.name === 'Raw' ? (
//                             <div className="monospace text-xs overflow-scroll pb-4 text-gray-600"
//                                  style={{
//                                      fontFamily: 'BerkeleyMono, monospace, Menlo, Monaco, "Courier New"',
//                                      whiteSpace: 'pre-wrap',
//                                      wordBreak: 'break-all',
//                                      wordWrap: 'break-word',
//                                  }}
//                                  dangerouslySetInnerHTML={{__html: converted.replace(/\n/g, '<br />')}}
//                             />
//                         ) : exporter?.name === 'SVG' ? (
//                             <SvgDisplay hues={hues} toSpace={toSpace} space={space} />
//                         ): !converted ? null : (
//                             <CodeEditor value={converted} language={exporter.extension.toLowerCase()} />
//                         )}
//                         {/* <CodeEditor value={JSON.stringify(colors, null, 2)} /> */}
//                     </div>
//                 </div>
//             </Modal>
//
//
//
//         </div>
//     )
// }
