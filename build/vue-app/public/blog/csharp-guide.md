# C# 从入门到精通（零基础到进阶）

**更新日期：** 2026-3-4 · **作者：** SnishaperTeam

## 目录
1. [什么是编程？]
2. [为什么选择 C#？]
3. [开发环境搭建]
4. [你的第一个 C# 程序]
5. [C# 基础语法]
   - [注释]
   - [命名规范]
6. [变量与数据类型]
   - [整数类型]
   - [浮点数类型]
   - [布尔类型]
   - [字符和字符串]
   - [类型转换]
7. [运算符]
   - [算术运算符]
   - [比较运算符]
   - [逻辑运算符]
   - [赋值运算符]
8. [控制流语句]
   - [if-else 语句]
   - [switch 语句]
   - [for 循环]
   - [while 循环]
   - [do-while 循环]
   - [break 和 continue]
9. [方法]
   - [方法定义]
   - [参数传递]
   - [返回值]
   - [方法重载]
10. [数组和集合]
    - [数组]
    - [List 集合]
    - [Dictionary 集合]
11. [字符串操作]
    - [字符串拼接]
    - [字符串格式化]
    - [字符串常用方法]
12. [异常处理
    - [try-catch 语句]
    - [finally 块]
    - [自定义异常]
13. [文件操作]
    - [读写文本文件]
    - [读写二进制文件]
14. [面向对象编程基础]
    - [类和对象]
    - [字段和属性]
    - [构造函数]
    - [方法]
15. [面向对象高级特性]
    - [封装]
    - [继承]
    - [多态]
    - [抽象类]
    - [接口]
16. [泛型]
    - [泛型类]
    - [泛型方法]
    - [泛型约束]
17. [委托和事件]
    - [委托]
    - [事件]
18. [LINQ]
    - [基本查询]
    - [方法语法]
19. [异步编程]
    - [async/await]
20. [实践项目：学生管理系统]

---

## 什么是编程？

编程就是用计算机能理解的语言，告诉计算机一步一步该做什么。就像你教小朋友做手工，需要详细说明每一步："先拿一张纸，然后对折，再剪掉一个角..."。计算机很聪明但也很死板，必须把每一步都写清楚。

### 编程语言的分类
- **机器语言**：直接用 0 和 1 编写（计算机直接理解，但人类很难写）
- **汇编语言**：用助记符代替 0/1（如 ADD, MOV）
- **高级语言**：更接近人类语言（如 C#, Python, Java）

C# 是一种高级语言，由微软在 2000 年发布，结合了 C++ 的强大和 Java 的简洁。

## 为什么选择 C#？

1. **简单易学**：语法清晰，自动管理内存（不用手动释放）
2. **用途广泛**：
   - Windows 桌面应用（WPF, WinForms）
   - 游戏开发（Unity 引擎主要用 C#）
   - Web 后端（ASP.NET Core）
   - 移动应用（Xamarin）
3. **强大的工具支持**：Visual Studio 是业界最好的 IDE 之一
4. **活跃的社区**：遇到问题容易找到解决方案

## 开发环境搭建

### 安装 Visual Studio
1. 访问 [Visual Studio 官网](https://visualstudio.microsoft.com/)
2. 下载 **Visual Studio Community**（免费版）
3. 安装时选择以下工作负载：
   - .NET 桌面开发
   - ASP.NET 和 Web 开发（可选）
   - 使用 C# 的移动开发（可选）

### 第一个项目创建
1. 打开 Visual Studio
2. 点击 "创建新项目"
3. 选择 "控制台应用 (.NET Core)"
4. 命名项目（如 `MyFirstApp`）
5. 点击 "创建"

## 你的第一个 C# 程序

创建项目后，你会看到 `Program.cs` 文件，内容如下：

```csharp
using System;

namespace MyFirstApp
{
    class Program
    {
        static void Main(string[] args)
        {
            Console.WriteLine("Hello, World!");
        }
    }
}
```

### 代码逐行解释
- `using System;`：导入系统命名空间，这样我们就能使用 `Console` 类。命名空间是组织代码的方式，避免不同库中的类名冲突。
- `namespace MyFirstApp`：定义命名空间，用于组织代码（避免名字冲突）。命名空间可以嵌套，比如 `MyCompany.MyApp.Utilities`。
- `class Program`：定义一个名为 Program 的类（C# 中所有代码必须在类中）。类是面向对象编程的基础，它包含数据（字段）和行为（方法）。
- `static void Main(string[] args)`：程序的入口点，操作系统会从这里开始执行。`static` 表示这个方法属于类本身而不是类的实例；`void` 表示没有返回值；`string[] args` 是命令行参数数组。
- `Console.WriteLine("Hello, World!");`：在控制台输出一行文字。`Console` 是 .NET 提供的类，用于控制台输入输出；`WriteLine` 方法输出文本并换行。

### 运行程序
按 `F5` 键运行，会看到黑色窗口显示 "Hello, World!"。

## C# 基础语法

### 注释
注释是写给人看的，计算机会忽略它们。

```csharp
// 单行注释

/*
多行注释
可以写很多行
*/

/// <summary>
/// XML 文档注释（用于生成文档）
/// </summary>
public void MyMethod()
{
}
```

**详解**：注释对于代码的可读性至关重要。单行注释用 `//`，适合简短说明；多行注释用 `/* */`，适合大段说明；XML 文档注释用 `///`，可以被工具提取生成 API 文档。

### 命名规范
- **PascalCase**：类名、方法名、属性名（如 `StudentManager`）
- **camelCase**：变量名、参数名（如 `studentCount`）
- **全大写**：常量（如 `MAX_STUDENTS`）

**详解**：遵循命名规范让代码更易读。PascalCase（首字母大写）用于公共成员，camelCase（首字母小写）用于私有成员和参数，这是 C# 社区的标准约定。

## 变量与数据类型

变量是存储数据的容器。每个变量都有类型，决定了它能存什么数据。

### 整数类型
| 类型 | 范围 | 用途 |
|------|------|------|
| `byte` | 0 到 255 | 小整数，如 RGB 颜色值 |
| `short` | -32,768 到 32,767 | 较小整数 |
| `int` | -2,147,483,648 到 2,147,483,647 | 最常用整数 |
| `long` | -9,223,372,036,854,775,808 到 9,223,372,036,854,775,807 | 大整数 |

```csharp
int age = 25;
long population = 7800000000L; // L 表示 long
```

**详解**：选择合适的整数类型很重要。`int` 是最常用的，范围足够大多数场景。当需要更大范围时用 `long`，注意要加 `L` 后缀。`byte` 用于节省内存的场景，如处理图像数据。

### 浮点数类型
| 类型 | 精度 | 用途 |
|------|------|------|
| `float` | 7 位 | 小数，需要 f 后缀 |
| `double` | 15-16 位 | 默认小数类型 |
| `decimal` | 28-29 位 | 金融计算（精确） |

```csharp
float price = 19.99f;
double pi = 3.1415926535;
decimal money = 100.50m; // m 表示 decimal
```

**详解**：`double` 是默认的浮点数类型，精度足够科学计算。`decimal` 用于金融计算，因为它能精确表示十进制小数，避免浮点数的舍入误差。`float` 用于内存敏感的场景，如游戏开发。

### 布尔类型
只有两个值：`true` 或 `false`

```csharp
bool isStudent = true;
bool hasPassed = false;
```

**详解**：布尔类型用于条件判断。C# 中布尔值不能与整数互换（不像 C/C++），这提高了代码的安全性。

### 字符和字符串
- `char`：单个字符，用单引号
- `string`：多个字符，用双引号

```csharp
char grade = 'A';
string name = "张三";
```

**详解**：`char` 占用 2 个字节（UTF-16），支持 Unicode 字符。`string` 是不可变的引用类型，每次修改都会创建新字符串，对于频繁修改的场景应使用 `StringBuilder`。

### 类型转换
#### 隐式转换（安全）
```csharp
int a = 10;
double b = a; // 自动转换，不会丢失数据
```

**详解**：隐式转换发生在从小类型到大类型的转换，不会丢失数据，编译器自动完成。

#### 显式转换（可能丢失数据）
```csharp
double c = 10.8;
int d = (int)c; // 结果是 10，小数部分被截断
```

**详解**：显式转换（强制类型转换）需要程序员明确指定，可能丢失数据或精度，编译器会发出警告。

#### 使用 Convert 类
```csharp
string numberStr = "123";
int number = Convert.ToInt32(numberStr);
```

**详解**：`Convert` 类提供了丰富的类型转换方法，支持各种数据类型之间的转换，包括字符串到数字。

#### 使用 Parse/TryParse
```csharp
// Parse：如果格式错误会抛出异常
int num1 = int.Parse("456");

// TryParse：更安全，返回 bool 表示是否成功
if (int.TryParse("abc", out int result))
{
    Console.WriteLine(result);
}
else
{
    Console.WriteLine("转换失败");
}
```

**详解**：`Parse` 方法在转换失败时抛出异常，适合确定输入格式正确的场景。`TryParse` 更安全，返回布尔值表示是否成功，推荐在用户输入等不确定场景使用。

## 运算符

### 算术运算符
```csharp
int a = 10, b = 3;
Console.WriteLine(a + b); // 13
Console.WriteLine(a - b); // 7
Console.WriteLine(a * b); // 30
Console.WriteLine(a / b); // 3（整数除法）
Console.WriteLine(a % b); // 1（取余）
```

**详解**：算术运算符用于基本数学运算。注意整数除法会截断小数部分，要得到精确结果需要至少一个操作数是浮点数。`%` 运算符返回除法的余数，常用于判断奇偶性或循环。

### 比较运算符
```csharp
int x = 5, y = 10;
Console.WriteLine(x == y); // False
Console.WriteLine(x != y); // True
Console.WriteLine(x < y);  // True
Console.WriteLine(x >= y); // False
```

**详解**：比较运算符返回布尔值，用于条件判断。`==` 和 `!=` 用于相等性比较，其他用于大小比较。注意字符串比较默认是区分大小写的。

### 逻辑运算符
```csharp
bool isAdult = true;
bool hasLicense = false;

Console.WriteLine(isAdult && hasLicense); // False（且）
Console.WriteLine(isAdult || hasLicense); // True（或）
Console.WriteLine(!isAdult);              // False（非）
```

**详解**：逻辑运算符用于组合布尔表达式。`&&` 是短路与（如果第一个为假，不计算第二个）；`||` 是短路或（如果第一个为真，不计算第二个）；`!` 是逻辑非。

### 赋值运算符
```csharp
int score = 100;
score += 10; // 等价于 score = score + 10
score -= 5;  // 等价于 score = score - 5
score *= 2;  // 等价于 score = score * 2
```

**详解**：复合赋值运算符简化了常见的操作模式。`+=`、`-=`、`*=`、`/=`、`%=` 等都是复合赋值运算符，提高代码可读性。

## 控制流语句

### if-else 语句
```csharp
int temperature = 25;

if (temperature > 30)
{
    Console.WriteLine("太热了！");
}
else if (temperature > 20)
{
    Console.WriteLine("天气很好！");
}
else
{
    Console.WriteLine("有点冷。");
}
```

**详解**：`if-else` 语句根据条件执行不同的代码块。条件必须是布尔表达式。`else if` 允许检查多个条件，`else` 是默认情况。大括号 `{}` 定义代码块，即使只有一行也建议使用。

### switch 语句
```csharp
char grade = 'B';

switch (grade)
{
    case 'A':
        Console.WriteLine("优秀");
        break;
    case 'B':
        Console.WriteLine("良好");
        break;
    case 'C':
        Console.WriteLine("及格");
        break;
    default:
        Console.WriteLine("不及格");
        break;
}
```

**详解**：`switch` 语句根据变量的值选择执行路径。每个 `case` 必须以 `break`、`return` 或 `throw` 结束，防止"贯穿"（fall through）。C# 8.0+ 支持 switch 表达式，语法更简洁。

### for 循环
```csharp
// 打印 1 到 5
for (int i = 1; i <= 5; i++)
{
    Console.WriteLine(i);
}

// 遍历数组
string[] fruits = {"苹果", "香蕉", "橙子"};
for (int i = 0; i < fruits.Length; i++)
{
    Console.WriteLine(fruits[i]);
}
```

**详解**：`for` 循环有三个部分：初始化、条件、迭代。适用于已知循环次数的场景。初始化变量通常只在循环内有效（作用域限制）。

### while 循环
```csharp
int count = 0;
while (count < 3)
{
    Console.WriteLine($"计数: {count}");
    count++;
}
```

**详解**：`while` 循环在条件为真时重复执行。先检查条件，再执行循环体，所以可能一次都不执行。适合循环次数未知的场景。

### do-while 循环
至少执行一次，然后检查条件
```csharp
int number;
do
{
    Console.Write("请输入一个正数: ");
    number = int.Parse(Console.ReadLine());
} while (number <= 0);
```

**详解**：`do-while` 循环先执行循环体，再检查条件，保证至少执行一次。适合需要先执行再验证的场景，如用户输入验证。

### break 和 continue
```csharp
// break：跳出循环
for (int i = 1; i <= 10; i++)
{
    if ( i == 5) break;
    Console.WriteLine(i); // 输出 1-4
}

// continue：跳过本次循环
for (int i = 1; i <= 5; i++)
{
    if (i == 3) continue;
    Console.WriteLine(i); // 输出 1,2,4,5
}
```

**详解**：`break` 立即终止整个循环；`continue` 跳过当前迭代，继续下一次循环。在嵌套循环中，它们只影响最内层的循环。

## 方法

### 方法定义
```csharp
// 语法：[访问修饰符] [返回类型] 方法名(参数列表)
public static void SayHello()
{
    Console.WriteLine("Hello!");
}

// 带参数的方法
public static void Greet(string name)
{
    Console.WriteLine($"你好，{name}！");
}

// 带返回值的方法
public static int Add(int a, int b)
{
    return a + b;
}
```

**详解**：方法是执行特定任务的代码块。`public` 表示公开访问；`static` 表示属于类而不是实例；`void` 表示无返回值；参数列表定义输入。方法名应描述其功能，使用动词开头。

### 参数传递
#### 值传递（默认）
```csharp
public static void ChangeValue(int x)
{
    x = 100; // 只改变副本，不影响原值
}

int num = 5;
ChangeValue(num);
Console.WriteLine(num); // 输出 5
```

**详解**：值类型（如 `int`、`bool`）默认按值传递，方法内修改的是副本，不影响原值。引用类型（如 `string`、对象）传递的是引用的副本，但通过引用可以修改对象的内容。

#### 引用传递（ref）
```csharp
public static void ChangeRef(ref int x)
{
    x = 100; // 直接修改原值
}

int num = 5;
ChangeRef(ref num);
Console.WriteLine(num); // 输出 100
```

**详解**：`ref` 关键字允许方法修改传入的变量本身。调用时必须加 `ref`，且变量必须已初始化。适用于需要返回多个值的场景。

#### 输出参数（out）
```csharp
public static bool TryParseNumber(string input, out int result)
{
    if (int.TryParse(input, out result))
    {
        return true;
    }
    result = 0;
    return false;
}

if (TryParseNumber("123", out int number))
{
    Console.WriteLine($"解析成功: {number}");
}
```

**详解**：`out` 参数用于返回额外的值。与 `ref` 不同，`out` 参数在方法内必须赋值，调用时不需要初始化。.NET 中很多 `TryXXX` 方法使用这种模式。

### 方法重载
同一个方法名，不同参数列表
```csharp
public static void Print(int value)
{
    Console.WriteLine($"整数: {value}");
}

public static void Print(double value)
{
    Console.WriteLine($"小数: {value}");
}

public static void Print(string value)
{
    Console.WriteLine($"文字: {value}");
}

// 调用
Print(42);      // 调用第一个
Print(3.14);    // 调用第二个
Print("Hello"); // 调用第三个
```

**详解**：方法重载允许同一个方法名有多个实现，根据参数类型和数量自动选择。重载不考虑返回类型，只看参数列表。这提高了 API 的灵活性和可读性。

## 数组和集合

### 数组
固定大小的同类型元素集合
```csharp
// 声明和初始化
int[] numbers = new int[5]; // 长度为5的整数数组
string[] names = {"张三", "李四", "王五"}; // 直接初始化

// 访问元素（索引从0开始）
Console.WriteLine(names[0]); // 张三

// 遍历数组
foreach (string name in names)
{
    Console.WriteLine(name);
}

// 多维数组
int[,] matrix = new int[3, 3];
matrix[0, 0] = 1; // 第一行第一列
```

**详解**：数组是基础的数据结构，大小固定，访问速度快（O(1)）。一维数组最常用，多维数组用于矩阵等场景。`foreach` 循环是遍历数组的安全方式，避免索引越界。

### List 集合
动态大小的列表
```csharp
List<string> students = new List<string>();

// 添加元素
students.Add("张三");
students.Add("李四");

// 访问元素
Console.WriteLine(students[0]);

// 遍历
foreach (string student in students)
{
    Console.WriteLine(student);
}

// 其他常用方法
students.Remove("张三");     // 移除指定元素
students.RemoveAt(0);       // 移除指定索引
students.Count;             // 获取元素数量
students.Contains("李四");   // 检查是否包含
```

**详解**：`List<T>` 是动态数组，大小可变，内部使用数组实现。添加/删除末尾元素快（O(1)），中间操作慢（O(n)）。比数组更灵活，是日常开发中最常用的集合。

### Dictionary 集合
键值对集合
```csharp
Dictionary<string, int> ages = new Dictionary<string, int>();

// 添加键值对
ages["张三"] = 20;
ages["李四"] = 22;

// 访问值
Console.WriteLine(ages["张三"]); // 20

// 检查键是否存在
if (ages.ContainsKey("王五"))
{
    Console.WriteLine(ages["王五"]);
}
else
{
    Console.WriteLine("找不到王五");
}

// 遍历
foreach (var kvp in ages)
{
    Console.WriteLine($"{kvp.Key}: {kvp.Value}");
}
```

**详解**：`Dictionary<TKey, TValue>` 提供基于键的快速查找（O(1)平均）。键必须唯一，值可以重复。适合需要通过标识符快速查找数据的场景，如缓存、配置等。

## 字符串操作

### 字符串拼接
```csharp
string firstName = "张";
string lastName = "三";
string fullName = firstName + lastName; // "张三"

// 更高效的方式：字符串插值
string message = $"你好，{fullName}！"; // "你好，张三！"
```

**详解**：字符串拼接有多种方式。`+` 操作符简单但效率低（每次创建新字符串）；字符串插值 `$"..."` 语法简洁，可读性好；对于大量拼接应使用 `StringBuilder`。

### 字符串格式化
```csharp
// 标准格式化
double price = 19.99;
Console.WriteLine($"价格: {price:C}"); // 货币格式
Console.WriteLine($"数字: {12345:N0}"); // 千分位分隔符

// 自定义格式化
DateTime now = DateTime.Now;
Console.WriteLine($"日期: {now:yyyy-MM-dd}"); // 2023-10-15
```

**详解**：格式化字符串控制数据的显示方式。标准格式说明符如 `C`（货币）、`N`（数字）、`D`（日期）等；自定义格式如 `yyyy-MM-dd` 提供更精细的控制。这在国际化应用中特别重要。

### 字符串常用方法
```csharp
string text = "  Hello World!  ";

Console.WriteLine(text.Trim());           // "Hello World!"
Console.WriteLine(text.ToLower());        // "  hello world!  "
Console.WriteLine(text.ToUpper());        // "  HELLO WORLD!  "
Console.WriteLine(text.Substring(2, 5));  // "llo W"
Console.WriteLine(text.Replace("World", "C#")); // "  Hello C#!  "
Console.WriteLine(text.Split(' '));       // ["", "", "Hello", "World!", "", ""]

// 检查字符串
Console.WriteLine(text.StartsWith("  H")); // True
Console.WriteLine(text.EndsWith("!  "));   // True
Console.WriteLine(text.Contains("World")); // True
```

**详解**：字符串类提供了丰富的方法处理文本。`Trim()` 移除首尾空白；`ToLower()/ToUpper()` 转换大小写；`Substring()` 提取子串；`Replace()` 替换文本；`Split()` 分割字符串。这些是文本处理的基础。

## 异常处理

### try-catch 语句
```csharp
try
{
    Console.Write("请输入一个数字: ");
    int number = int.Parse(Console.ReadLine());
    Console.WriteLine($"你输入的数字是: {number}");
}
catch (FormatException ex)
{
    Console.WriteLine("输入格式错误: " + ex.Message);
}
catch (OverflowException ex)
{
    Console.WriteLine("数字太大了: " + ex.Message);
}
catch (Exception ex)
{
    Console.WriteLine("发生未知错误: " + ex.Message);
}
```

**详解**：异常处理用于处理运行时错误。`try` 块包含可能出错的代码；`catch` 块处理特定类型的异常。应捕获具体的异常类型，最后用通用 `Exception` 捕获未知错误。异常信息 (`ex.Message`) 帮助诊断问题。

### finally 块
无论是否发生异常都会执行
```csharp
FileStream file = null;
try
{
    file = new FileStream("data.txt", FileMode.Open);
    // 读取文件
}
catch (FileNotFoundException)
{
    Console.WriteLine("文件未找到");
}
finally
{
    if (file != null)
    {
        file.Close(); // 确保文件被关闭
    }
}
```

**详解**：`finally` 块用于清理资源，无论是否发生异常都会执行。这是确保资源（如文件、数据库连接）被正确释放的关键机制。现代 C# 推荐使用 `using` 语句自动管理资源。

### 自定义异常
```csharp
// 定义自定义异常类
public class InvalidAgeException : Exception
{
    public InvalidAgeException(string message) : base(message) { }
}

// 使用自定义异常
public static void SetAge(int age)
{
    if (age < 0 || age > 150)
    {
        throw new InvalidAgeException("年龄必须在0-150之间");
    }
    // 设置年龄的逻辑
}
```

**详解**：自定义异常用于表示应用程序特定的错误条件。继承 `Exception` 类，提供有意义的错误信息。这使调用者能区分不同类型的错误并采取相应措施。

## 文件操作

### 读写文本文件
```csharp
// 写入文件
string[] lines = { "第一行", "第二行", "第三行" };
File.WriteAllLines("notes.txt", lines);

// 读取文件
string[] content = File.ReadAllLines("notes.txt");
foreach (string line in content)
{
    Console.WriteLine(line);
}

// 追加内容
File.AppendAllText("notes.txt", "\n新内容");
```

**详解**：`File` 类提供了简单的文件操作方法。`WriteAllLines` 写入字符串数组；`ReadAllLines` 读取所有行到数组；`AppendAllText` 追加文本。这些方法适合小文件，大文件应使用流式处理。

### 读写二进制文件
```csharp
// 写入二进制数据
byte[] data = { 1, 2, 3, 4, 5 };
File.WriteAllBytes("data.bin", data);

// 读取二进制数据
byte[] readData = File.ReadAllBytes("data.bin");
```

**详解**：二进制文件操作处理原始字节数据。`WriteAllBytes` 写入字节数组；`ReadAllBytes` 读取所有字节到数组。适合处理图片、音频等非文本数据。

## 面向对象编程基础

### 类和对象
- **类（Class）**：蓝图或模板，定义了对象的属性和行为
- **对象（Object）**：类的实例，具体的实体

```csharp
// 定义类
public class Student
{
    // 字段（存储数据）
    public string Name;
    public int Age;
    
    // 方法（行为）
    public void Study()
    {
        Console.WriteLine($"{Name}正在学习");
    }
}

// 创建对象
Student student1 = new Student();
student1.Name = "张三";
student1.Age = 20;
student1.Study(); // 输出: 张三正在学习
```

**详解**：面向对象编程（OOP）的核心是类和对象。类定义数据（字段）和行为（方法）；对象是类的具体实例。`new` 关键字创建对象实例。OOP 提高了代码的模块化和可重用性。

### 字段和属性
字段是直接的变量，属性提供了对字段的受控访问。

```csharp
public class Person
{
    // 私有字段（外部不能直接访问）
    private string _name;
    
    // 属性
    public string Name
    {
        get { return _name; }
        set { _name = value; }
    }
    
    // 自动实现的属性（简化写法）
    public int Age { get; set; }
}

// 使用
Person p = new Person();
p.Name = "李四"; // 调用 set
Console.WriteLine(p.Name); // 调用 get
```

**详解**：属性是字段的安全包装。`get` 访问器返回值；`set` 访问器设置值（`value` 是隐式参数）。自动属性 `public int Age { get; set; }` 自动生成私有字段，简化代码。属性允许在访问时添加验证逻辑。

### 构造函数
特殊方法，用于初始化对象。

```csharp
public class Car
{
    public string Brand { get; set; }
    public string Color { get; set; }
    
    // 默认构造函数
    public Car()
    {
        Brand = "未知";
        Color = "白色";
    }
    
    // 带参数的构造函数
    public Car(string brand, string color)
    {
        Brand = brand;
        Color = color;
    }
}

// 使用
Car car1 = new Car(); // 使用默认构造函数
Car car2 = new Car("丰田", "红色"); // 使用带参数构造函数
```

**详解**：构造函数在创建对象时自动调用，用于初始化状态。如果没有定义构造函数，编译器会提供默认的无参构造函数。定义带参数的构造函数可以确保对象创建时处于有效状态。

### 方法
对象的行为。

```csharp
public class Calculator
{
    // 实例方法
    public int Add(int a, int b)
    {
        return a + b;
    }
    
    // 静态方法（不需要创建对象）
    public static int Multiply(int a, int b)
    {
        return a * b;
    }
}

// 使用
Calculator calc = new Calculator();
int sum = calc.Add(5, 3); // 8

int product = Calculator.Multiply(4, 6); // 24（直接用类名调用）
```

**详解**：方法定义对象的行为。实例方法需要对象实例调用；静态方法属于类本身，直接用类名调用。静态方法不能访问实例成员，适合工具方法。

## 面向对象高级特性

### 封装
隐藏内部实现细节，只暴露必要的接口。

```csharp
public class BankAccount
{
    private decimal _balance;
    
    // 公共属性，但有验证逻辑
    public decimal Balance
    {
        get { return _balance; }
        private set { _balance = value; } // 只有类内部可以设置
    }
    
    public void Deposit(decimal amount)
    {
        if (amount > 0)
        {
            _balance += amount;
        }
    }
    
    public bool Withdraw(decimal amount)
    {
        if (amount > 0 && amount <= _balance)
        {
            _balance -= amount;
            return true;
        }
        return false;
    }
}
```

**详解**：封装是 OOP 的基本原则，通过访问修饰符（`private`、`public` 等）控制成员的可见性。私有成员只能在类内部访问，公共接口提供受控访问。这保护了对象的内部状态，防止无效操作。

### 继承
子类继承父类的属性和方法，实现代码复用。

```csharp
// 基类
public class Animal
{
    public string Name { get; set; }
    
    public virtual void MakeSound() // virtual 允许子类重写
    {
        Console.WriteLine("动物发出声音");
    }
}

// 派生类
public class Dog : Animal
{
    public override void MakeSound() // 重写基类方法
    {
        Console.WriteLine("汪汪！");
    }
    
    public void Fetch() // 子类特有方法
    {
        Console.WriteLine("狗在捡球");
    }
}

// 使用
Dog myDog = new Dog();
myDog.Name = "小白";
myDog.MakeSound(); // 汪汪！
myDog.Fetch();     // 狗在捡球
```

**详解**：继承实现"is-a"关系，子类获得父类的所有公共和受保护成员。`virtual` 关键字标记可重写的方法；`override` 重写父类方法。继承促进代码复用，但应避免过深的继承层次。

### 多态
同一操作作用于不同对象，产生不同结果。

```csharp
// 创建不同类型的动物
Animal[] animals = {
    new Dog(),
    new Cat(), // 假设 Cat 也继承 Animal
    new Animal()
};

// 调用相同方法，但行为不同
foreach (Animal animal in animals)
{
    animal.MakeSound(); // 每个动物发出不同的声音
}
```

**详解**：多态允许使用基类引用调用派生类的方法。运行时根据实际对象类型决定调用哪个方法。这提高了代码的灵活性和可扩展性，是设计模式的基础。

### 抽象类
不能被实例化的类，通常包含抽象方法（没有实现）。

```csharp
public abstract class Shape
{
    // 抽象方法，子类必须实现
    public abstract double CalculateArea();
    
    // 普通方法
    public void Display()
    {
        Console.WriteLine($"面积: {CalculateArea()}");
    }
}

public class Circle : Shape
{
    public double Radius { get; set; }
    
    public override double CalculateArea()
    {
        return Math.PI * Radius * Radius;
    }
}

// 使用
Circle circle = new Circle { Radius = 5 };
circle.Display(); // 面积: 78.53981633974483
```

**详解**：抽象类定义共同接口和部分实现，强制子类实现特定方法。`abstract` 类不能实例化，只能被继承。抽象方法没有实现，必须在非抽象子类中重写。这确保了子类的一致性。

### 接口
定义契约，类可以实现多个接口。

```csharp
// 定义接口
public interface IFlyable
{
    void Fly();
}

public interface ISwimmable
{
    void Swim();
}

// 实现多个接口
public class Duck : Animal, IFlyable, ISwimmable
{
    public void Fly()
    {
        Console.WriteLine("鸭子在飞");
    }
    
    public void Swim()
    {
        Console.WriteLine("鸭子在游泳");
    }
    
    public override void MakeSound()
    {
        Console.WriteLine("嘎嘎！");
    }
}

// 使用
Duck duck = new Duck();
duck.Fly();   // 鸭子在飞
duck.Swim();  // 鸭子在游泳
```

**详解**：接口定义方法签名但不提供实现。类可以实现多个接口，解决单继承的限制。接口实现"is-capable-of"关系，比继承更灵活。C# 8.0+ 支持默认接口方法，提供部分实现。

## 泛型

### 泛型类
```csharp
public class Box<T>
{
    private T _item;
    
    public void SetItem(T item)
    {
        _item = item;
    }
    
    public T GetItem()
    {
        return _item;
    }
}

// 使用
Box<int> intBox = new Box<int>();
intBox.SetItem(42);
int number = intBox.GetItem();

Box<string> stringBox = new Box<string>();
stringBox.SetItem("Hello");
string text = stringBox.GetItem();
```

**详解**：泛型允许编写类型安全的可重用代码。`T` 是类型参数，在实例化时指定具体类型。泛型避免了类型转换和装箱/拆箱，提高性能和安全性。`List<T>`、`Dictionary<TKey, TValue>` 都是泛型集合。

### 泛型方法
```csharp
public static void Swap<T>(ref T a, ref T b)
{
    T temp = a;
    a = b;
    b = temp;
}

// 使用
int x = 5, y = 10;
Swap(ref x, ref y); // x=10, y=5

string s1 = "Hello", s2 = "World";
Swap(ref s1, ref s2); // s1="World", s2="Hello"
```

**详解**：泛型方法在方法级别定义类型参数。编译器根据参数类型推断 `T`，无需显式指定。泛型方法提供类型安全的操作，适用于各种类型。

### 泛型约束
限制泛型类型必须满足的条件。

```csharp
// T 必须有无参构造函数
public class Creator<T> where T : new()
{
    public T CreateInstance()
    {
        return new T();
    }
}

// T 必须继承 Animal
public class AnimalHandler<T> where T : Animal
{
    public void Handle(T animal)
    {
        animal.MakeSound();
    }
}

// T 必须实现 IComparable
public class Sorter<T> where T : IComparable<T>
{
    public void Sort(T[] array)
    {
        Array.Sort(array);
    }
}
```

**详解**：泛型约束确保类型参数满足特定要求。`where T : new()` 要求有无参构造函数；`where T : Animal` 要求继承特定类；`where T : IComparable<T>` 要求实现接口。约束使泛型代码能安全地使用类型特定的功能。

## 委托和事件

### 委托
委托是一种类型安全的函数指针。

```csharp
// 定义委托
public delegate void MessageHandler(string message);

// 使用委托
public class Logger
{
    public MessageHandler OnMessage;
    
    public void Log(string message)
    {
        OnMessage?.Invoke(message); // 调用所有订阅的方法
    }
}

// 订阅委托
Logger logger = new Logger();
logger.OnMessage += Console.WriteLine; // 订阅控制台输出
logger.OnMessage += FileLogger;        // 订阅文件日志

logger.Log("这是一条日志"); // 同时输出到控制台和文件

void FileLogger(string message)
{
    File.AppendAllText("log.txt", message + Environment.NewLine);
}
```

**详解**：委托封装方法引用，允许将方法作为参数传递。`MessageHandler` 委托可以引用任何接受 `string` 参数并返回 `void` 的方法。`+=` 操作符订阅方法，`-=` 取消订阅。委托支持多播（调用多个方法）。

### 事件
事件是特殊的委托，提供更安全的发布-订阅模式。

```csharp
public class Button
{
    // 定义事件
    public event EventHandler Click;
    
    public void PerformClick()
    {
        Click?.Invoke(this, EventArgs.Empty);
    }
}

// 使用
Button button = new Button();
button.Click += OnButtonClick; // 订阅事件

void OnButtonClick(object sender, EventArgs e)
{
    Console.WriteLine("按钮被点击了！");
}

button.PerformClick(); // 触发事件
```

**详解**：事件基于委托，但提供封装：外部代码只能订阅/取消订阅，不能直接调用或清空事件。`EventHandler` 是标准事件委托，`sender` 是事件源，`EventArgs` 包含事件数据。事件是 GUI 编程和异步操作的基础。

## LINQ

### 基本查询
```csharp
List<int> numbers = new List<int> { 1, 2, 3, 4, 5, 6, 7, 8, 9, 10 };

// 查询语法
var evenNumbers = from n in numbers
                  where n % 2 == 0
                  select n;

// 方法语法
var evenNumbers2 = numbers.Where(n => n % 2 == 0);

foreach (int num in evenNumbers)
{
    Console.WriteLine(num); // 2,4,6,8,10
}
```

**详解**：LINQ（Language Integrated Query）提供统一的数据查询语法。查询语法类似 SQL；方法语法使用扩展方法和 lambda 表达式。LINQ 支持延迟执行，查询在遍历时才执行，提高性能。

### 复杂查询
```csharp
var students = new List<Student>
{
    new Student { Name = "张三", Age = 20, Grade = 85 },
    new Student { Name = "李四", Age = 22, Grade = 92 },
    new Student { Name = "王五", Age = 19, Grade = 78 }
};

// 找出成绩大于80的学生，按年龄排序
var goodStudents = students
    .Where(s => s.Grade > 80)
    .OrderBy(s => s.Age)
    .Select(s => s.Name);

foreach (string name in goodStudents)
{
    Console.WriteLine(name); // 张三, 李四
}
```

**详解**：LINQ 支持链式操作，组合多个查询操作。`Where` 过滤；`OrderBy` 排序；`Select` 投影（转换）。LINQ 不仅适用于集合，还支持数据库（Entity Framework）、XML 等数据源。

## 异步编程

### async/await
```csharp
// 异步方法
public async Task<string> DownloadWebPageAsync(string url)
{
    using (HttpClient client = new HttpClient())
    {
        string content = await client.GetStringAsync(url);
        return content;
    }
}

// 调用异步方法
public async Task ProcessWebPageAsync()
{
    try
    {
        string html = await DownloadWebPageAsync("https://example.com");
        Console.WriteLine($"页面长度: {html.Length}");
    }
    catch (HttpRequestException ex)
    {
        Console.WriteLine($"网络错误: {ex.Message}");
    }
}
```

**详解**：异步编程避免阻塞主线程，提高应用响应性。`async` 修饰符标记异步方法；`await` 暂停方法执行，等待异步操作完成。`Task` 表示异步操作，`Task<T>` 表示返回值的异步操作。异步方法应以 `Async` 后缀命名。

## 实践项目：学生管理系统

综合运用前面学到的知识，创建一个简单的学生管理系统。

```csharp
using System;
using System.Collections.Generic;
using System.Linq;

// 学生类
public class Student
{
    public int Id { get; set; }
    public string Name { get; set; }
    public int Age { get; set; }
    public string Major { get; set; }
    
    public override string ToString()
    {
        return $"ID: {Id}, 姓名: {Name}, 年龄: {Age}, 专业: {Major}";
    }
}

// 学生管理器
public class StudentManager
{
    private List<Student> students = new List<Student>();
    private int nextId = 1;
    
    // 添加学生
    public void AddStudent(string name, int age, string major)
    {
        students.Add(new Student
        {
            Id = nextId++,
            Name = name,
            Age = age,
            Major = major
        });
        Console.WriteLine("学生添加成功！");
    }
    
    // 查找学生
    public Student FindStudent(int id)
    {
        return students.FirstOrDefault(s => s.Id == id);
    }
    
    // 删除学生
    public bool RemoveStudent(int id)
    {
        var student = FindStudent(id);
        if (student != null)
        {
            students.Remove(student);
            return true;
        }
        return false;
    }
    
    // 显示所有学生
    public void DisplayAllStudents()
    {
        if (students.Count == 0)
        {
            Console.WriteLine("暂无学生信息");
            return;
        }
        
        Console.WriteLine("所有学生信息:");
        foreach (var student in students)
        {
            Console.WriteLine(student);
        }
    }
    
    // 按专业筛选
    public List<Student> GetStudentsByMajor(string major)
    {
        return students.Where(s => s.Major.Equals(major, StringComparison.OrdinalIgnoreCase)).ToList();
    }
}

// 主程序
class Program
{
    static StudentManager manager = new StudentManager();
    
    static void Main(string[] args)
    {
        while (true)
        {
            Console.WriteLine("\n=== 学生管理系统 ===");
            Console.WriteLine("1. 添加学生");
            Console.WriteLine("2. 查看所有学生");
            Console.WriteLine("3. 按专业查询");
            Console.WriteLine("4. 删除学生");
            Console.WriteLine("5. 退出");
            Console.Write("请选择操作: ");
            
            string choice = Console.ReadLine();
            
            switch (choice)
            {
                case "1":
                    AddStudent();
                    break;
                case "2":
                    manager.DisplayAllStudents();
                    break;
                case "3":
                    SearchByMajor();
                    break;
                case "4":
                    DeleteStudent();
                    break;
                case "5":
                    return;
                default:
                    Console.WriteLine("无效选择，请重试");
                    break;
            }
        }
    }
    
    static void AddStudent()
    {
        Console.Write("姓名: ");
        string name = Console.ReadLine();
        
        Console.Write("年龄: ");
        if (!int.TryParse(Console.ReadLine(), out int age) || age <= 0)
        {
            Console.WriteLine("年龄必须是正整数");
            return;
        }
        
        Console.Write("专业: ");
        string major = Console.ReadLine();
        
        manager.AddStudent(name, age, major);
    }
    
    static void SearchByMajor()
    {
        Console.Write("请输入专业: ");
        string major = Console.ReadLine();
        var students = manager.GetStudentsByMajor(major);
        
        if (students.Count == 0)
        {
            Console.WriteLine("未找到该专业的学生");
        }
        else
        {
            Console.WriteLine($"专业 '{major}' 的学生:");
            foreach (var student in students)
            {
                Console.WriteLine(student);
            }
        }
    }
    
    static void DeleteStudent()
    {
        Console.Write("请输入要删除的学生ID: ");
        if (!int.TryParse(Console.ReadLine(), out int id))
        {
            Console.WriteLine("ID必须是数字");
            return;
        }
        
        if (manager.RemoveStudent(id))
        {
            Console.WriteLine("学生删除成功");
        }
        else
        {
            Console.WriteLine("未找到该ID的学生");
        }
    }
}
```

**代码详解**：
- **Student 类**：使用自动属性存储学生信息，重写 `ToString()` 提供友好的显示格式
- **StudentManager 类**：封装学生数据操作，使用 `List<Student>` 存储数据
- **LINQ 查询**：`FirstOrDefault` 查找单个学生，`Where` 筛选专业
- **输入验证**：使用 `TryParse` 安全解析用户输入
- **菜单驱动**：主循环提供用户交互界面

这个项目涵盖了：
- 类和对象
- 集合（List）
- LINQ 查询
- 异常处理
- 用户交互
- 面向对象设计

通过这个项目，你可以巩固前面学到的所有概念，并理解如何将它们组合起来解决实际问题。

## 总结

C# 是一门强大而优雅的编程语言，从简单的控制台应用到复杂的企业级系统都能胜任。学习路径建议：

1. **掌握基础**：变量、控制流、方法
2. **理解面向对象**：类、继承、多态
3. **学习高级特性**：泛型、委托、LINQ
4. **实践项目**：从小项目开始，逐步增加复杂度
5. **深入特定领域**：根据兴趣选择 WPF、ASP.NET、Unity 等方向

记住：编程最重要的是**动手实践**。不要只是阅读，要写代码、调试、解决问题。遇到困难时，善用搜索引擎和社区资源。祝你学习愉快！