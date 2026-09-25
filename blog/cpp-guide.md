# C++完全入门指南：从Hello World到结构体

**更新日期：** 2026-12-28 · **作者：** SnishaperTeam

## 引言

C++是一门强大的编程语言，它结合了高级编程特性和底层系统编程能力。从1983年由Bjarne Stroustrup发明至今，C++已经广泛应用于系统软件、游戏开发、嵌入式系统、高性能计算等领域。本指南将带你从零开始，逐步学习C++编程。

## 0.环境准备

C++是一门编译型语言，所以需要一个编译器。
这里推荐使用MinGW+Clion编译器，也可以使用微软VS编译器
### 0.1.MinGW+Clion

首先下载MSYS2用来安装MinGW, [清华大学镜像站直链下载](https://mirrors.tuna.tsinghua.edu.cn/msys2/distrib/msys2-x86_64-latest.exe)。
下载安装后，打开**msys终端**，先把镜像站更换一下，这里是bash的命令，直接输入  
```
   # 1. 修改 MSYS 软件源
sed -i '1i Server = https://mirrors.huaweicloud.com/msys2/msys/$arch/' /etc/pacman.d/mirrorlist.msys

# 2. 修改 MinGW64 软件源
sed -i '1i Server = https://mirrors.huaweicloud.com/msys2/mingw/x86_64/' /etc/pacman.d/mirrorlist.mingw64

# 3. 修改 MinGW32 软件源
sed -i '1i Server = https://mirrors.huaweicloud.com/msys2/mingw/i686/' /etc/pacman.d/mirrorlist.mingw32

# 4. 刷新软件包数据库
pacman -Sy
```
然后关闭终端打开**MinGW64终端**
运行一下bash命令:
```
pacman -S --needed --noconfirm mingw-w64-x86_64-toolchain mingw-w64-x86_64-ninja
```
然后会让你选择，直接默认，全选y等待安装
安装完成后，在cmd执行:
```
gcc -v
```
如果输出类似于：
```
Using built-in specs.
COLLECT_GCC=gcc
COLLECT_LTO_WRAPPER=D:/msys64/mingw64/bin/../lib/gcc/x86_64-w64-mingw32/15.2.0/lto-wrapper.exe
Target: x86_64-w64-mingw32
Configured with: ../gcc-15.2.0/configure --prefix=/mingw64 --with-local-prefix=/mingw64/local --with-native-system-header-dir=/mingw64/include --libexecdir=/mingw64/lib --enable-bootstrap --enable-checking=release --with-arch=nocona --with-tune=generic --enable-mingw-wildcard --enable-languages=c,lto,c++,fortran,ada,objc,obj-c++,jit --enable-shared --enable-static --enable-libatomic --enable-threads=posix --enable-graphite --enable-fully-dynamic-string --enable-libstdcxx-backtrace=yes --enable-libstdcxx-filesystem-ts --enable-libstdcxx-time --disable-libstdcxx-pch --enable-lto --enable-libgomp --disable-libssp --disable-multilib --disable-rpath --disable-win32-registry --disable-nls --disable-werror --disable-symvers --with-libiconv --with-system-zlib --with-gmp=/mingw64 --with-mpfr=/mingw64 --with-mpc=/mingw64 --with-isl=/mingw64 --with-pkgversion='Rev8, Built by MSYS2 project' --with-bugurl=https://github.com/msys2/MINGW-packages/issues --with-gnu-as --with-gnu-ld --with-libstdcxx-zoneinfo=yes --disable-libstdcxx-debug --enable-plugin --with-boot-ldflags=-static-libstdc++ --with-stage1-ldflags=-static-libstdc++
Thread model: posix
Supported LTO compression algorithms: zlib zstd
gcc version 15.2.0 (Rev8, Built by MSYS2 project)
```
就说明安装成功了
接下来下载Clion, 打开Clion[下载页面](https://www.jetbrains.com.cn/clion/download/?section=windows)单击下载，然后正常流程安装。
安装后，打开clion，如果弹出订阅，选非商业使用（如果你有需要，请支持Clion[购买](https://www.jetbrains.com.cn/clion/buy/?section=personal&billing=monthly)）
然后单击左下角齿轮图标，单击设置，选择构建、执行、部署，再选择工具链，把工具集的路径改为刚才执行gcc -v里的COLLECT_LTO_WRAPPER=D:/msys64/mingw64/bin/../lib/gcc/x86_64-w64-mingw32/15.2.0/lto-wrapper.exe前面的例如我是D:/msys64/mingw64就改成这个
>这样就MinGW+Clion的配置就完成了
### 0.2. VS的配置
首先打开VS的[官网](https://visualstudio.microsoft.com/zh-hans/downloads/)，选择Community版本下载，打开安装程序，选择版本安装，主页选择工作负载为C++桌面开发，然后直接开始安装就好了
>这样VS的配置就完成了

`不过我觉得MinGW+Clion会占用空间少一点，大概9GB，而VS2026至少得40GB`
#### 这样我们开发的环境就准备好了，开启你的编码之旅吧!🙃
## 1. Hello World程序详解

学习任何编程语言的第一步都是编写Hello World程序。这不仅是传统，更是检查开发环境是否配置正确的有效方法。让我们从一个简单的C++程序开始：

```cpp
#include <iostream>

int main() {
    std::cout << "Hello, World!" << std::endl;
    return 0;
}
```

### 1.1 代码解析

- **`#include <iostream>`**：这是一个预处理指令，告诉编译器包含输入输出流库。iostream库提供了输入输出功能，如`std::cout`（输出）和`std::cin`（输入）。
- **`int main()`**：这是程序的入口点。每个C++程序都必须有一个main函数，操作系统从这里开始执行程序。
- **`std::cout`**：这是标准输出流对象，用于向屏幕输出文本。`"std::"`表示使用标准命名空间。
- **`<<`**：这是流插入操作符，用于将数据插入到输出流中。
- **`std::endl`**：这不仅输出一个换行符，还刷新输出缓冲区，确保内容立即显示。
- **`return 0;`**：表示程序正常结束。返回值0通常表示成功执行。

### 1.2 编译和运行

要编译这个程序，你需要一个C++编译器（如g++、clang++或MSVC）。使用命令行编译和运行：

```bash
# 编译
g++ -o hello hello.cpp

# 运行
./hello
```

## 2. 变量和数据类型

C++提供了丰富的数据类型来处理不同类型的数据。了解这些类型是编程的基础。

### 2.1 基本数据类型

- **`int`**：整数类型，通常为32位
- **`float`**：单精度浮点数
- **`double`**：双精度浮点数
- **`char`**：字符类型
- **`bool`**：布尔类型（true/false）

```cpp
#include <iostream>
using namespace std;

int main() {
    int age = 25;
    float price = 19.99f;
    double precise = 3.141592653589793;
    char grade = 'A';
    bool isStudent = true;
    
    cout << "年龄: " << age << endl;
    cout << "价格: $" << price << endl;
    cout << "圆周率: " << precise << endl;
    cout << "等级: " << grade << endl;
    cout << "是否学生: " << isStudent << endl;
    
    return 0;
}
```

### 2.2 变量命名规则

- 必须以字母或下划线开头
- 不能使用C++关键字（如`int`、`return`等）
- 区分大小写
- 推荐使用有意义的名字

### 2.3 常量

使用`const`关键字声明常量，一旦初始化就不能修改：

```cpp
const int MAX_SIZE = 100;
const double PI = 3.14159;
```

## 3. 运算符

C++提供了丰富的运算符来执行各种计算和操作。

### 3.1 算术运算符

- **`+`**：加法
- **`-`**：减法
- **`*`**：乘法
- **`/`**：除法
- **`%`**：取模（求余数）

```cpp
int a = 10, b = 3;
cout << "a + b = " << (a + b) << endl;  // 13
cout << "a - b = " << (a - b) << endl;  // 7
cout << "a * b = " << (a * b) << endl;  // 30
cout << "a / b = " << (a / b) << endl;  // 3 (整数除法)
cout << "a % b = " << (a % b) << endl;  // 1
```

### 3.2 比较运算符

- **`==`**：相等
- **`!=`**：不等
- **`<`**：小于
- **`>`**：大于
- **`<=`**：小于等于
- **`>=`**：大于等于

### 3.3 逻辑运算符

- **`&&`**：逻辑与
- **`||`**：逻辑或
- **`!`**：逻辑非

### 3.4 赋值运算符

```cpp
int x = 5;      // 基本赋值
x += 3;         // 等同于 x = x + 3
x -= 2;         // 等同于 x = x - 2
x *= 4;         // 等同于 x = x * 4
x /= 2;         // 等同于 x = x / 2
```

## 4. 控制流语句

控制流语句允许程序根据条件执行不同的代码块或重复执行某些代码。

### 4.1 if-else语句

```cpp
int score = 85;

if (score >= 90) {
    cout << "优秀" << endl;
} else if (score >= 80) {
    cout << "良好" << endl;
} else if (score >= 70) {
    cout << "中等" << endl;
} else {
    cout << "需要努力" << endl;
}
```

### 4.2 switch语句

```cpp
int day = 3;
switch (day) {
    case 1:
        cout << "星期一" << endl;
        break;
    case 2:
        cout << "星期二" << endl;
        break;
    case 3:
        cout << "星期三" << endl;
        break;
    default:
        cout << "其他日子" << endl;
}
```

### 4.3 循环语句

#### 4.3.1 for循环

```cpp
// 打印0到9
for (int i = 0; i < 10; i++) {
    cout << i << " ";
}

// 打印9到0
for (int i = 9; i >= 0; i--) {
    cout << i << " ";
}
```

#### 4.3.2 while循环

```cpp
int count = 0;
while (count < 5) {
    cout << "计数: " << count << endl;
    count++;
}
```

#### 4.3.3 do-while循环

```cpp
int i = 0;
do {
    cout << i << " ";
    i++;
} while (i < 5);
```

### 4.4 break和continue

- **`break`**：立即退出循环或switch语句
- **`continue`**：跳过当前循环迭代，继续下一次迭代

```cpp
// 使用break
for (int i = 0; i < 10; i++) {
    if (i == 5) {
        break;  // 当i为5时退出循环
    }
    cout << i << " ";
}  // 输出: 0 1 2 3 4

// 使用continue
for (int i = 0; i < 10; i++) {
    if (i % 2 == 0) {
        continue;  // 跳过偶数
    }
    cout << i << " ";  // 输出: 1 3 5 7 9
}
```

## 5. 数组

数组是存储相同类型元素的集合。它们在处理大量数据时非常有用。

### 5.1 一维数组

```cpp
// 声明并初始化数组
int numbers[5] = {1, 2, 3, 4, 5};
double prices[3] = {19.99, 25.50, 30.00};
char vowels[5] = {'a', 'e', 'i', 'o', 'u'};

// 访问数组元素（索引从0开始）
cout << "第一个数字: " << numbers[0] << endl;  // 1
cout << "第三个数字: " << numbers[2] << endl;  // 3

// 修改数组元素
numbers[0] = 10;
cout << "修改后第一个数字: " << numbers[0] << endl;  // 10

// 遍历数组
for (int i = 0; i < 5; i++) {
    cout << numbers[i] << " ";
}
```

### 5.2 二维数组

```cpp
// 声明二维数组
int matrix[3][3] = {
    {1, 2, 3},
    {4, 5, 6},
    {7, 8, 9}
};

// 访问二维数组元素
cout << "matrix[0][0]: " << matrix[0][0] << endl;  // 1
cout << "matrix[1][2]: " << matrix[1][2] << endl;  // 6

// 遍历二维数组
for (int i = 0; i < 3; i++) {
    for (int j = 0; j < 3; j++) {
        cout << matrix[i][j] << " ";
    }
    cout << endl;
}
```

### 5.3 字符串处理

C++提供了两种处理字符串的方式：C风格字符串和C++ string类。

```cpp
#include <iostream>
#include <string>
using namespace std;

int main() {
    // C++ string类（推荐）
    string name = "张三";
    string greeting = "Hello, " + name + "!";
    cout << greeting << endl;
    
    // 字符串长度
    cout << "姓名长度: " << name.length() << endl;
    
    // 字符串连接
    string fullName = name + " " + "李四";
    cout << "全名: " << fullName << endl;
    
    // 访问单个字符
    cout << "第一个字符: " << name[0] << endl;
    
    // 字符串比较
    if (name == "张三") {
        cout << "匹配成功!" << endl;
    }
    
    return 0;
}
```

## 6. 函数

函数是执行特定任务的代码块。它们提高了代码的可重用性和可维护性。

### 6.1 函数定义和调用

```cpp
#include <iostream>
using namespace std;

// 函数定义
int add(int a, int b) {
    return a + b;
}

// 无返回值函数
void printHello() {
    cout << "Hello from function!" << endl;
}

// 带默认参数的函数
int multiply(int x, int y = 1) {
    return x * y;
}

int main() {
    // 调用函数
    int sum = add(5, 3);
    cout << "5 + 3 = " << sum << endl;  // 8
    
    printHello();  // 输出: Hello from function!
    
    cout << multiply(5) << endl;     // 使用默认参数: 5
    cout << multiply(5, 3) << endl;  // 指定参数: 15
    
    return 0;
}
```

### 6.2 函数参数传递

#### 6.2.1 按值传递

```cpp
void modifyValue(int x) {
    x = 100;  // 只修改副本，不影响原变量
}

int main() {
    int num = 50;
    cout << "修改前: " << num << endl;  // 50
    modifyValue(num);
    cout << "修改后: " << num << endl;  // 仍然是50
    return 0;
}
```

#### 6.2.2 按引用传递

```cpp
void modifyValue(int& x) {  // 注意&符号
    x = 100;  // 修改原变量
}

int main() {
    int num = 50;
    cout << "修改前: " << num << endl;  // 50
    modifyValue(num);
    cout << "修改后: " << num << endl;  // 100
    return 0;
}
```

### 6.3 递归函数

```cpp
// 计算阶乘的递归函数
int factorial(int n) {
    if (n <= 1) {
        return 1;  // 基础情况
    }
    return n * factorial(n - 1);  // 递归调用
}

int main() {
    cout << "5! = " << factorial(5) << endl;  // 120
    return 0;
}
```

## 7. 指针

指针是C++中一个强大但容易混淆的概念。指针存储变量的内存地址。

### 7.1 指针基础

```cpp
#include <iostream>
using namespace std;

int main() {
    int value = 42;
    int* ptr = &value;  // ptr指向value的地址
    
    cout << "值: " << value << endl;           // 42
    cout << "地址: " << &value << endl;        // value的地址
    cout << "指针值: " << ptr << endl;         // ptr存储的地址
    cout << "解引用: " << *ptr << endl;        // 通过指针访问值
    
    // 通过指针修改值
    *ptr = 100;
    cout << "修改后: " << value << endl;       // 100
    
    return 0;
}
```

### 7.2 指针与数组

```cpp
int arr[] = {10, 20, 30, 40, 50};
int* ptr = arr;  // 指针指向数组第一个元素

// 通过指针访问数组元素
cout << "arr[0]: " << *ptr << endl;        // 10
cout << "arr[1]: " << *(ptr + 1) << endl;  // 20
cout << "arr[2]: " << *(ptr + 2) << endl;  // 30

// 遍历数组
for (int i = 0; i < 5; i++) {
    cout << *(ptr + i) << " ";  // 等同于 arr[i]
}
```

### 7.3 动态内存分配

```cpp
#include <iostream>
using namespace std;

int main() {
    // 动态分配内存
    int* ptr = new int(42);
    cout << "动态分配的值: " << *ptr << endl;  // 42
    
    // 动态分配数组
    int size = 5;
    int* arr = new int[size];
    
    // 初始化数组
    for (int i = 0; i < size; i++) {
        arr[i] = i * i;
    }
    
    // 输出数组
    for (int i = 0; i < size; i++) {
        cout << arr[i] << " ";
    }
    
    // 释放内存
    delete ptr;
    delete[] arr;  // 注意使用delete[]释放数组
    
    return 0;
}
```

## 8. 结构体

结构体(struct)是C++中定义自定义数据类型的一种方式，它允许将不同类型的数据组合在一起。

### 8.1 基本结构体

```cpp
#include <iostream>
#include <string>
using namespace std;

// 定义结构体
struct Student {
    string name;
    int age;
    double gpa;
    char grade;
};

int main() {
    // 创建结构体实例
    Student s1;
    s1.name = "张三";
    s1.age = 20;
    s1.gpa = 3.75;
    s1.grade = 'A';
    
    // 访问结构体成员
    cout << "姓名: " << s1.name << endl;
    cout << "年龄: " << s1.age << endl;
    cout << "GPA: " << s1.gpa << endl;
    cout << "等级: " << s1.grade << endl;
    
    // 另一种初始化方式
    Student s2 = {"李四", 21, 3.85, 'A'};
    
    return 0;
}
```

### 8.2 结构体数组

```cpp
struct Book {
    string title;
    string author;
    int year;
    double price;
};

int main() {
    // 结构体数组
    Book library[3] = {
        {"C++ Primer", "Stanley Lippman", 2012, 59.99},
        {"Effective C++", "Scott Meyers", 2005, 45.50},
        {"The C++ Programming Language", "Bjarne Stroustrup", 2013, 65.00}
    };
    
    // 遍历结构体数组
    for (int i = 0; i < 3; i++) {
        cout << "书名: " << library[i].title << endl;
        cout << "作者: " << library[i].author << endl;
        cout << "年份: " << library[i].year << endl;
        cout << "价格: $" << library[i].price << endl;
        cout << "---------" << endl;
    }
    
    return 0;
}
```

### 8.3 结构体与函数

```cpp
struct Rectangle {
    double width;
    double height;
};

// 计算面积的函数
double calculateArea(Rectangle rect) {
    return rect.width * rect.height;
}

// 修改结构体的函数（按引用传递）
void scaleRectangle(Rectangle& rect, double factor) {
    rect.width *= factor;
    rect.height *= factor;
}

int main() {
    Rectangle r = {5.0, 3.0};
    
    cout << "面积: " << calculateArea(r) << endl;  // 15
    
    scaleRectangle(r, 2.0);
    cout << "缩放后的面积: " << calculateArea(r) << endl;  // 60
    
    return 0;
}
```

### 8.4 结构体嵌套

```cpp
struct Address {
    string street;
    string city;
    string state;
    int zipCode;
};

struct Person {
    string name;
    int age;
    Address address;  // 结构体作为成员
};

int main() {
    Person p = {
        "王五",
        25,
        {"123 Main St", "北京", "北京", 100001}
    };
    
    cout << "姓名: " << p.name << endl;
    cout << "地址: " << p.address.street << ", " 
         << p.address.city << ", " << p.address.state 
         << " " << p.address.zipCode << endl;
    
    return 0;
}
```

### 8.5 typedef和结构体

```cpp
// 为结构体定义别名
typedef struct Point {
    double x;
    double y;
} Point;

// 或者使用更现代的方式
struct Point3D {
    double x, y, z;
};

using Point3DPtr = Point3D*;  // 使用using定义别名

int main() {
    Point p = {1.0, 2.0};
    Point3D p3d = {1.0, 2.0, 3.0};
    
    Point3DPtr ptr = &p3d;  // 使用别名定义指针
    
    cout << "点 (" << p.x << ", " << p.y << ")" << endl;
    
    return 0;
}
```

## 总结

本指南涵盖了C++编程的基础知识，从最简单的Hello World程序到结构体的概念。学习C++需要时间和实践，建议您：

- 多编写代码并运行测试
- 理解每个概念的实际应用
- 逐步构建更复杂的程序
- 阅读优秀的C++代码和文档
- 实践是掌握编程语言的最好方法

掌握了这些基础知识后，您可以继续学习更高级的主题，如类和对象、继承、多态、模板、STL标准库等。C++是一门功能强大的语言，掌握它将为您的编程生涯打开许多门。

记住，编程是一门实践性很强的技能。不要只是阅读教程，要动手编写代码，尝试修改示例，创建自己的小项目。通过实践，您将更好地理解和掌握C++编程。