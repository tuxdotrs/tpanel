cmake_minimum_required(VERSION 3.20)
project(tshell-cardwire LANGUAGES CXX)

set(CMAKE_CXX_STANDARD 20)
set(CMAKE_CXX_STANDARD_REQUIRED ON)
set(CMAKE_AUTOMOC ON)

find_package(Qt6 REQUIRED COMPONENTS Core Qml DBus)

qt_add_library(tshellcardwire SHARED src/cardwire.cpp src/cardwire.hpp)
target_include_directories(tshellcardwire PUBLIC "${CMAKE_CURRENT_SOURCE_DIR}/src")

qt_add_qml_module(tshellcardwire
	URI Tshell.Cardwire
	VERSION 0.1
	DEPENDENCIES QtQml
	OUTPUT_DIRECTORY "${CMAKE_CURRENT_BINARY_DIR}/Tshell/Cardwire"
)

target_link_libraries(tshellcardwire PRIVATE Qt6::Core Qt6::Qml Qt6::DBus)

# Keep the backing library next to the plugin so "$ORIGIN" rpaths resolve both
# in the build tree and after install.
set(module_build_dir "${CMAKE_CURRENT_BINARY_DIR}/Tshell/Cardwire")
set_target_properties(tshellcardwire tshellcardwireplugin PROPERTIES
	LIBRARY_OUTPUT_DIRECTORY "${module_build_dir}"
	RUNTIME_OUTPUT_DIRECTORY "${module_build_dir}"
	ARCHIVE_OUTPUT_DIRECTORY "${module_build_dir}"
	BUILD_RPATH "$ORIGIN"
	INSTALL_RPATH "$ORIGIN"
)

qt_query_qml_module(tshellcardwire
	PLUGIN_TARGET module_plugin_target
	TARGET_PATH module_target_path
	QMLDIR module_qmldir
	TYPEINFO module_typeinfo
)

set(module_dir "${CMAKE_INSTALL_PREFIX}/lib/qt-6/qml/${module_target_path}")

install(TARGETS tshellcardwire "${module_plugin_target}"
	LIBRARY DESTINATION "${module_dir}"
	RUNTIME DESTINATION "${module_dir}"
)
install(FILES "${module_qmldir}" "${module_typeinfo}" DESTINATION "${module_dir}")
